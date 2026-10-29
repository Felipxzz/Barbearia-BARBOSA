import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const attempts = new Map<string, { count: number; time: number }>();
const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const serviceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).max(80), nome: z.string().trim().min(1).max(100),
  valor: z.number().min(0).max(100000), preco: z.string().max(40), duracao: z.string().min(1).max(40),
  categoria: z.enum(["cortes", "barba", "combos", "outros"]), descricao: z.string().max(1000),
  destaque: z.boolean().optional(), ativo: z.boolean().optional(),
});
const barberSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/).max(80), nome: z.string().trim().min(1).max(100),
  foto: z.string().max(2000).optional(), especialidade: z.string().max(200), descricao: z.string().max(1000),
  servicos: z.array(z.string().max(100)).max(100), whatsapp: z.string().regex(/^\d{10,13}$/), ativo: z.boolean().optional(),
});
const catalogSchema = z.object({ servicos: z.array(serviceSchema).min(1).max(100), barbeiros: z.array(barberSchema).min(1).max(30) });
const appointmentSchema = z.object({
  nome: z.string().trim().min(1).max(100).regex(/^[^0-9]+$/).optional(), telefone: z.string().regex(/^\d{10,13}$/).optional(),
  servico: z.string().min(1).max(500).optional(), barbeiro: z.string().regex(/^[a-z0-9-]+$/).optional(),
  dia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), horario: z.string().regex(/^(0[8-9]|1[0-9]):00$/).optional(),
  obs: z.string().max(2000).optional(),
});
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return reply({ error: "Solicitação inválida" }, 405);
  try {
    const body = await req.json();
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return reply({ error: "Serviço indisponível" }, 503);
    const db = createClient(url, key);
    if (body.action === "catalog-public") {
      const { data, error } = await db.from("barbosa_catalog").select("servicos,barbeiros").eq("id", "principal").maybeSingle();
      return error ? reply({ error: "Erro ao carregar catálogo" }, 500) : reply({ data });
    }
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const record = attempts.get(ip);
    if (record && Date.now() - record.time < 15 * 60 * 1000 && record.count >= 5) return reply({ error: "Muitas tentativas. Tente novamente em 15 minutos." }, 429);
    const secret = Deno.env.get("ADMIN_PASSWORD");
    if (!secret || typeof body.password !== "string" || body.password !== secret) {
      const count = record && Date.now() - record.time < 15 * 60 * 1000 ? record.count + 1 : 1;
      attempts.set(ip, { count, time: Date.now() });
      return reply({ error: "Senha incorreta" }, 401);
    }
    attempts.delete(ip);
    if (body.action === "login-check") return reply({ success: true });
    if (body.action === "list") {
      const { data, error } = await db.from("agendamentos").select("id,nome,telefone,servico,barbeiro,dia,horario,obs,created_at").neq("status", "cancelado").order("dia").order("horario");
      return error ? reply({ error: "Erro ao carregar agendamentos" }, 500) : reply({ data });
    }
    const audit = (acao: string, tipo: string, descricao: string, antes: unknown = null, depois: unknown = null, telefone: string | null = null) =>
      db.from("admin_audit_logs").insert({ acao, tipo, descricao, antes, depois, telefone }).then(() => undefined, () => undefined);
    if (body.action === "audit-list") {
      const { data, error } = await db.from("admin_audit_logs").select("id,acao,tipo,descricao,telefone,antes,depois,created_at").order("created_at", { ascending: false }).limit(200);
      return error ? reply({ error: "Erro ao carregar atividades" }, 500) : reply({ data });
    }
    if (body.action === "history") {
      const { data, error } = await db.from("agendamentos").select("id,nome,telefone,servico,barbeiro,dia,horario,obs,status,created_at").order("dia", { ascending: false }).limit(2000);
      return error ? reply({ error: "Erro ao carregar histórico" }, 500) : reply({ data });
    }
    if (body.action === "reviews-list") {
      const { data, error } = await db.from("avaliacoes").select("id,nome,nota,texto,status,created_at").order("created_at", { ascending: false }).limit(200);
      return error ? reply({ error: "Erro ao carregar avaliações" }, 500) : reply({ data });
    }
    if (body.action === "review-moderate") {
      const parsed = z.object({ id: z.string().uuid(), status: z.enum(["aprovada", "rejeitada", "pendente"]) }).safeParse(body);
      if (!parsed.success) return reply({ error: "Avaliação inválida" }, 400);
      const { data: prev } = await db.from("avaliacoes").select("nome,status").eq("id", parsed.data.id).maybeSingle();
      const { error } = await db.from("avaliacoes").update({ status: parsed.data.status }).eq("id", parsed.data.id);
      if (error) return reply({ error: "Erro ao moderar avaliação" }, 500);
      await audit("moderacao", "avaliacao", `Avaliação de ${prev?.nome ?? "cliente"} marcada como ${parsed.data.status}`, prev, { status: parsed.data.status });
      return reply({ success: true });
    }
    if (body.action === "catalog-save") {
      const parsed = catalogSchema.safeParse(body.catalog);
      if (!parsed.success) return reply({ error: "Revise os dados: nomes, preços, duração e WhatsApp são obrigatórios." }, 400);
      const catalog = parsed.data;
      if (new Set(catalog.servicos.map(s => s.id)).size !== catalog.servicos.length || new Set(catalog.barbeiros.map(b => b.id)).size !== catalog.barbeiros.length) return reply({ error: "Identificadores devem ser únicos." }, 400);
      if (!catalog.servicos.some(s => s.ativo !== false) || !catalog.barbeiros.some(b => b.ativo !== false)) return reply({ error: "Mantenha ao menos um serviço e um profissional ativos." }, 400);
      catalog.servicos = catalog.servicos.map(s => ({ ...s, preco: `R$${s.valor.toLocaleString("pt-BR")}` }));
      const { error } = await db.from("barbosa_catalog").upsert({ id: "principal", ...catalog, updated_at: new Date().toISOString() });
      if (error) return reply({ error: "Erro ao salvar catálogo" }, 500);
      await audit("edicao", "catalogo", `Catálogo atualizado: ${catalog.servicos.length} serviços, ${catalog.barbeiros.length} profissionais`);
      return reply({ success: true });
    }
    if (!z.string().uuid().safeParse(body.id).success) return reply({ error: "Agendamento inválido" }, 400);
    const { data: before } = await db.from("agendamentos").select("nome,telefone,servico,barbeiro,dia,horario,obs").eq("id", body.id).maybeSingle();
    if (body.action === "delete") {
      const { error } = await db.from("agendamentos").update({ status: "cancelado", cancelado_em: new Date().toISOString() }).eq("id", body.id);
      if (error) return reply({ error: "Erro ao cancelar agendamento" }, 500);
      await audit("cancelamento", "agendamento", `Agendamento de ${before?.nome ?? "cliente"} (${before?.dia ?? ""} ${before?.horario ?? ""}) cancelado pelo painel`, before, null, before?.telefone ?? null);
      return reply({ success: true });
    }
    if (body.action === "update") {
      const parsed = appointmentSchema.safeParse(body.updates);
      if (!parsed.success || Object.keys(parsed.data).length === 0) return reply({ error: "Revise os dados do agendamento." }, 400);
      const { error } = await db.from("agendamentos").update(parsed.data).eq("id", body.id);
      if (error) return reply({ error: error.code === "23505" ? "Horário já reservado. Escolha outro." : "Erro ao atualizar agendamento" }, 400);
      const remarcado = before && (before.dia !== parsed.data.dia || before.horario !== parsed.data.horario);
      await audit(remarcado ? "remarcacao" : "edicao", "agendamento", `Agendamento de ${parsed.data.nome ?? before?.nome ?? "cliente"} ${remarcado ? `remarcado para ${parsed.data.dia} ${parsed.data.horario}` : "editado"}`, before, parsed.data, before?.telefone ?? null);
      return reply({ success: true });
    }
    return reply({ error: "Ação inválida" }, 400);
  } catch {
    return reply({ error: "Não foi possível processar a solicitação. Tente novamente." }, 500);
  }
});
