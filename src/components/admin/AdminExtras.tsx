import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Star, RefreshCw, History, Wallet, CalendarRange, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { financeSummary, isMonthlyPlan, localDay, normalizePhone, type Appointment } from "@/lib/admin";
import type { Catalog } from "@/hooks/use-catalog";

type Invoke = (body: Record<string, unknown>) => Promise<{ data?: unknown }>;
type Row = Appointment & { status?: string };
const money = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmt = (d: string) => d.split("-").reverse().join("/");

const useAdminData = <T,>(invoke: Invoke, action: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try { const r = await invoke({ action }); setData((r.data as T[]) ?? []); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erro ao carregar"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, setData, loading, load };
};

const Loading = () => <p role="status" className="text-muted-foreground text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" />Carregando…</p>;

export const FinanceView = ({ invoke, catalog }: { invoke: Invoke; catalog: Catalog }) => {
  const { data, loading } = useAdminData<Row>(invoke, "history");
  const today = localDay();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const preset = (days: number | "mes") => {
    const d = new Date();
    if (days === "mes") { setFrom(localDay(new Date(d.getFullYear(), d.getMonth(), 1))); setTo(localDay(new Date(d.getFullYear(), d.getMonth() + 1, 0))); return; }
    const start = new Date(); start.setDate(d.getDate() - days + 1); setFrom(localDay(start)); setTo(today);
  };
  const s = useMemo(() => financeSummary(data, catalog.servicos, from, to), [data, catalog.servicos, from, to]);
  const name = (id: string) => catalog.barbeiros.find(b => b.id === id)?.nome ?? id;
  return <>
    <div className="admin-section-title"><div><h2>Fechamento</h2><p className="text-sm text-muted-foreground">Valores estimados pelos preços atuais dos serviços; cancelados não entram.</p></div>
      <div className="admin-segment"><Button size="sm" variant="ghost" onClick={() => preset(1)}>Hoje</Button><Button size="sm" variant="ghost" onClick={() => preset(7)}>7 dias</Button><Button size="sm" variant="ghost" onClick={() => preset("mes")}>Este mês</Button></div></div>
    <div className="admin-filters"><label className="text-sm">De <input type="date" aria-label="Data inicial" value={from} onChange={e => setFrom(e.target.value)} /></label><label className="text-sm">Até <input type="date" aria-label="Data final" value={to} onChange={e => setTo(e.target.value)} /></label></div>
    {loading ? <Loading /> : <>
      <div className="admin-stats">{[["Faturamento", money(s.total)], ["Atendimentos", String(s.atendimentos)], ["Ticket médio", money(s.ticketMedio)], ["Serviço top", s.servicos[0]?.nome ?? "—"]].map(([t, v]) => <article key={t} className="admin-stat barbosa-card card-anim"><div className="flex justify-between gap-3"><span>{t}</span><Wallet className="text-primary w-5 h-5" /></div><strong className="!text-3xl">{v}</strong></article>)}</div>
      <div className="admin-catalog-grid">
        {s.porBarbeiro.map(b => <article key={b.barbeiro} className="admin-catalog-item barbosa-card card-anim"><span className="barbosa-eyebrow">PROFISSIONAL</span><h3 className="mt-2">{name(b.barbeiro)}</h3><p className="text-sm text-muted-foreground mt-2">{b.cortes} atendimentos</p><strong className="text-primary text-xl block mt-2">{money(b.total)}</strong></article>)}
        <article className="admin-catalog-item barbosa-card card-anim"><span className="barbosa-eyebrow">MAIS PROCURADOS</span>{s.servicos.length === 0 && <p className="text-sm text-muted-foreground mt-3">Sem atendimentos no período.</p>}{s.servicos.slice(0, 6).map(sv => <p key={sv.nome} className="flex justify-between text-sm mt-3"><span>{sv.nome}</span><strong>{sv.qtd}</strong></p>)}</article>
      </div>
    </>}
  </>;
};

export const PlansView = ({ invoke, catalog }: { invoke: Invoke; catalog: Catalog }) => {
  const { data, loading } = useAdminData<Row>(invoke, "history");
  const month = localDay().slice(0, 7);
  const today = localDay();
  const clients = useMemo(() => {
    const map = new Map<string, { nome: string; telefone: string; usados: number; restantes: number; proximo?: string; ultimo: string }>();
    for (const a of data.filter(a => isMonthlyPlan(a) && a.status !== "cancelado" && a.dia.startsWith(month))) {
      const k = normalizePhone(a.telefone);
      const c = map.get(k) ?? { nome: a.nome, telefone: a.telefone, usados: 0, restantes: 0, ultimo: a.dia };
      if (a.dia < today) c.usados++; else { c.restantes++; if (!c.proximo || a.dia < c.proximo) c.proximo = a.dia; }
      if (a.dia > c.ultimo) c.ultimo = a.dia;
      map.set(k, c);
    }
    return [...map.values()];
  }, [data, month, today]);
  const renew = (d: string) => { const x = new Date(`${d}T12:00:00`); return fmt(localDay(new Date(x.getFullYear(), x.getMonth() + 1, 1))); };
  void catalog;
  return <>
    <div className="admin-section-title"><div><h2>Plano mensal</h2><p className="text-sm text-muted-foreground">{clients.length} clientes com plano neste mês</p></div></div>
    {loading ? <Loading /> : clients.length === 0 ? <div className="admin-empty"><CalendarRange /><h3>Nenhum plano ativo neste mês</h3></div> :
      <div className="admin-catalog-grid">{clients.map(c => <article key={c.telefone} className="admin-catalog-item barbosa-card card-anim"><h3>{c.nome}</h3><p className="text-sm text-muted-foreground">{c.telefone}</p><p className="text-sm mt-4">Cortes usados: <strong className="text-primary">{c.usados}</strong></p><p className="text-sm">Restantes no mês: <strong className="text-primary">{c.restantes}</strong></p><p className="text-xs text-muted-foreground mt-3">{c.proximo ? `Próximo: ${fmt(c.proximo)} · ` : ""}Renovação: {renew(c.ultimo)}</p></article>)}</div>}
  </>;
};

type Log = { id: string; acao: string; tipo: string; descricao: string; created_at: string };
const acaoLabel: Record<string, string> = { cancelamento: "Cancelamento", remarcacao: "Remarcação", edicao: "Edição", moderacao: "Moderação" };
export const ActivityView = ({ invoke }: { invoke: Invoke }) => {
  const { data, loading, load } = useAdminData<Log>(invoke, "audit-list");
  return <>
    <div className="admin-section-title"><div><h2>Atividades recentes</h2><p className="text-sm text-muted-foreground">Registro das alterações feitas pelo painel</p></div><Button variant="outline" size="sm" onClick={() => void load()}><RefreshCw />Atualizar</Button></div>
    {loading ? <Loading /> : data.length === 0 ? <div className="admin-empty"><History /><h3>Nenhuma atividade registrada</h3><p>Edições, remarcações e cancelamentos aparecerão aqui.</p></div> :
      <div className="admin-agenda-list">{data.map(l => <article key={l.id} className="admin-appointment card-anim"><div className="admin-appointment-time"><strong className="!text-base">{new Date(l.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</strong><span>{new Date(l.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span></div><div className="admin-appointment-info"><h3>{acaoLabel[l.acao] ?? l.acao}</h3><p>{l.descricao}</p></div></article>)}</div>}
  </>;
};

type Review = { id: string; nome: string; nota: number; texto: string; status: string; created_at: string };
export const ReviewsView = ({ invoke }: { invoke: Invoke }) => {
  const { data, setData, loading } = useAdminData<Review>(invoke, "reviews-list");
  const [filter, setFilter] = useState("pendente");
  const moderate = async (id: string, status: string) => {
    try { await invoke({ action: "review-moderate", id, status }); setData(prev => prev.map(r => r.id === id ? { ...r, status } : r)); toast.success(status === "aprovada" ? "Avaliação publicada no site." : "Avaliação atualizada."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
  };
  const list = data.filter(r => r.status === filter);
  return <>
    <div className="admin-section-title"><div><h2>Avaliações dos clientes</h2><p className="text-sm text-muted-foreground">Só as aprovadas aparecem no site</p></div>
      <div className="admin-segment">{[["pendente", "Pendentes"], ["aprovada", "Aprovadas"], ["rejeitada", "Rejeitadas"]].map(([k, l]) => <Button key={k} size="sm" variant={filter === k ? "default" : "ghost"} onClick={() => setFilter(k)}>{l} ({data.filter(r => r.status === k).length})</Button>)}</div></div>
    {loading ? <Loading /> : list.length === 0 ? <div className="admin-empty"><Star /><h3>Nenhuma avaliação aqui</h3></div> :
      <div className="admin-catalog-grid">{list.map(r => <article key={r.id} className="admin-catalog-item barbosa-card card-anim"><div className="flex gap-1 text-primary">{Array.from({ length: r.nota }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div><p className="text-sm mt-3">"{r.texto}"</p><strong className="text-primary text-sm block mt-3">{r.nome}</strong><small className="text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</small><div className="flex gap-2 mt-4">{r.status !== "aprovada" && <Button size="sm" onClick={() => moderate(r.id, "aprovada")}><Check />Aprovar</Button>}{r.status !== "rejeitada" && <Button size="sm" variant="outline" onClick={() => moderate(r.id, "rejeitada")}><X />Rejeitar</Button>}</div></article>)}</div>}
  </>;
};

export const ExportIcon = Download;
