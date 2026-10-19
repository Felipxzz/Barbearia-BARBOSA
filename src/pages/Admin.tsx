import { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import "@/styles/barbosa.css";
import { Trash2, LogOut, Lock, Pencil, X, Check, ShieldAlert, Filter, BellRing } from "lucide-react";

const SERVICOS = [
  { id: "corte", nome: "Corte", preco: "R$30" },
  { id: "plano", nome: "Plano Mensal", preco: "R$70" },
  { id: "pezinho", nome: "Pezinho", preco: "R$10" },
  { id: "barba", nome: "Barba", preco: "R$15" },
  { id: "corte-barba", nome: "Corte + Barba", preco: "R$40" },
  { id: "pigmentacao", nome: "Pigmentação", preco: "R$15" },
  { id: "luzes", nome: "Luzes", preco: "R$100" },
  { id: "platinado", nome: "Platinado", preco: "R$120" },
];

const BARBEIROS = ["Kauan", "Ryan"];

interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  servico: string;
  barbeiro: string;
  dia: string;
  horario: string;
  obs: string | null;
  created_at: string;
}

type LoginStep = "password" | "authenticated";

const Admin = () => {
  const [senha, setSenha] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loginStep, setLoginStep] = useState<LoginStep>("password");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [senhaArmazenada, setSenhaArmazenada] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editServico, setEditServico] = useState("");
  const [tentativas, setTentativas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tick, setTick] = useState(0);

  // Atualiza os lembretes a cada minuto
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  // Filters
  const [filtroBarbeiro, setFiltroBarbeiro] = useState("");
  const [filtroDia, setFiltroDia] = useState("");

  const fetchAgendamentos = useCallback(async (pass: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-agendamentos", {
      body: { password: pass, action: "list" },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Erro ao carregar agendamentos");
      if (data?.error === "Senha incorreta") {
        setLoginStep("password");
      }
    } else {
      setAgendamentos(data.data || []);
    }
    setLoading(false);
  }, []);

  const handlePasswordSubmit = async () => {
    const pass = senha.trim();
    if (!pass || bloqueado) return;
    setLoading(true);

    const { data, error } = await supabase.functions.invoke("admin-agendamentos", {
      body: { password: pass, action: "list" },
    });

    let serverMsg = data?.error as string | undefined;
    if (!serverMsg && error) {
      try {
        const ctx = (error as { context?: Response }).context;
        if (ctx && typeof ctx.json === "function") {
          const j = await ctx.json();
          serverMsg = j?.error;
        }
      } catch { /* ignore */ }
    }

    if (error || serverMsg) {
      const msg = serverMsg || "Erro de conexão. Tente novamente.";

      if (msg.includes("Muitas tentativas")) {
        setBloqueado(true);
        toast.error("Bloqueado por muitas tentativas. Aguarde 15 minutos.");
        setTimeout(() => { setBloqueado(false); setTentativas(0); }, 15 * 60 * 1000);
      } else if (msg === "Senha incorreta") {
        const n = tentativas + 1;
        setTentativas(n);
        toast.error(`Senha incorreta (${Math.max(0, 5 - n)} tentativas restantes)`);
      } else {
        toast.error(msg);
      }
      setLoading(false);
      return;
    }

    setSenhaArmazenada(pass);
    setTentativas(0);
    setLoginStep("authenticated");
    setAgendamentos(data.data || []);
    setLoading(false);
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento e liberar o horário?")) return;
    const { data, error } = await supabase.functions.invoke("admin-agendamentos", {
      body: { password: senhaArmazenada, action: "delete", id },
    });
    if (error || data?.error) {
      toast.error("Erro ao deletar");
      return;
    }
    toast.success("Horário liberado com sucesso!");
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEditStart = (a: Agendamento) => {
    setEditingId(a.id);
    setEditServico(a.servico);
  };

  const handleEditSave = async (id: string) => {
    const { data, error } = await supabase.functions.invoke("admin-agendamentos", {
      body: { password: senhaArmazenada, action: "update", id, updates: { servico: editServico } },
    });
    if (error || data?.error) {
      toast.error("Erro ao atualizar");
      return;
    }
    toast.success("Serviço atualizado!");
    setAgendamentos((prev) => prev.map((a) => a.id === id ? { ...a, servico: editServico } : a));
    setEditingId(null);
  };

  const agendamentosFiltrados = useMemo(() => {
    const hoje = new Date().toISOString().split("T")[0];
    return agendamentos.filter((a) => {
      if (a.dia < hoje) return false;
      if (filtroBarbeiro && a.barbeiro.toLowerCase() !== filtroBarbeiro.toLowerCase()) return false;
      if (filtroDia && a.dia !== filtroDia) return false;
      return true;
    });
  }, [agendamentos, filtroBarbeiro, filtroDia]);

  // Lembretes: agendamentos que começam na próxima 1 hora
  const lembretes = useMemo(() => {
    const agora = new Date();
    return agendamentos
      .map((a) => {
        const [h, m] = a.horario.split(":").map(Number);
        const quando = new Date(`${a.dia}T00:00:00`);
        quando.setHours(h, m || 0, 0, 0);
        return { a, quando, minutos: Math.round((quando.getTime() - agora.getTime()) / 60000) };
      })
      .filter((x) => x.minutos >= 0 && x.minutos <= 60)
      .sort((x, y) => x.minutos - y.minutos);
  }, [agendamentos, tick]);

  const enviarLembrete = (a: Agendamento) => {
    const tel = a.telefone.replace(/\D/g, "");
    const numero = tel.length <= 11 ? `55${tel}` : tel;
    const hoje = new Date().toISOString().split("T")[0];
    const [ano, mes, dia] = a.dia.split("-");
    const quando = a.dia === hoje ? "hoje" : `em ${dia}/${mes}/${ano}`;
    const msg =
      `Barbearia Barbosa\n` +
      `──────────────\n` +
      `Olá, ${a.nome}! Tudo bem?\n\n` +
      `Este é um lembrete do seu agendamento ${quando}, às ${a.horario}h, com o barbeiro ${a.barbeiro}.\n` +
      `Serviço: ${a.servico}\n\n` +
      `Pedimos a gentileza de confirmar sua presença respondendo esta mensagem.\n` +
      `Caso precise remarcar ou cancelar, avise-nos com antecedência.\n\n` +
      `Agradecemos a preferência!\n` +
      `Barbearia Barbosa ✂️`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Unique days for the filter
  const diasDisponiveis = useMemo(() => {
    const s = new Set(agendamentos.map((a) => a.dia));
    return Array.from(s).sort();
  }, [agendamentos]);

  // Add noindex meta tag
  if (typeof document !== "undefined") {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
  }

  // PASSWORD STEP
  if (loginStep === "password") {
    return (
      <div className="barbosa-site min-h-screen bg-background flex items-center justify-center p-4">
        <div className="card-anim w-full max-w-sm space-y-6 bg-card border border-border rounded-xl p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-gold text-2xl font-bold">Painel Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">Barbearia Barbosa</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Senha de administrador"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              disabled={bloqueado}
              className="w-full p-3.5 rounded-xl border-none bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            {bloqueado && (
              <div className="flex items-center gap-2 text-destructive text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Bloqueado por muitas tentativas. Aguarde 15 min.</span>
              </div>
            )}
            <button
              onClick={handlePasswordSubmit}
              disabled={loading || bloqueado}
              className="w-full py-3.5 rounded-xl gradient-gold text-primary-foreground font-bold text-sm disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED - DASHBOARD
  return (
    <div className="barbosa-site min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gold text-xl font-bold">Painel Admin</h1>
          <button
            onClick={() => { setLoginStep("password"); setSenha(""); setSenhaArmazenada(""); }}
            className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        {/* Lembretes 1h antes */}
        {lembretes.length > 0 && (
          <div className="card-anim bg-card rounded-xl p-4 mb-4 border border-gold-subtle">
            <div className="flex items-center gap-2 text-gold text-sm font-bold mb-3">
              <BellRing className="w-4 h-4" />
              <span>Lembretes — próxima 1 hora</span>
            </div>
            <div className="space-y-2">
              {lembretes.map(({ a, minutos }) => (
                <div key={a.id} className="flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <p className="text-foreground font-medium">{a.nome} — {a.horario}</p>
                    <p className="text-muted-foreground text-xs">
                      em {minutos} min · {a.barbeiro} · {a.servico}
                    </p>
                  </div>
                  <button
                    onClick={() => enviarLembrete(a)}
                    className="px-3 py-2 rounded-lg gradient-gold text-primary-foreground text-xs font-bold whitespace-nowrap"
                  >
                    Enviar lembrete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card-anim bg-card rounded-xl p-4 mb-4 space-y-3 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroBarbeiro}
              onChange={(e) => setFiltroBarbeiro(e.target.value)}
              className="bg-background text-foreground text-sm rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos os barbeiros</option>
              {BARBEIROS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={filtroDia}
              onChange={(e) => setFiltroDia(e.target.value)}
              className="bg-background text-foreground text-sm rounded-lg px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Todos os dias</option>
              {diasDisponiveis.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {(filtroBarbeiro || filtroDia) && (
              <button
                onClick={() => { setFiltroBarbeiro(""); setFiltroDia(""); }}
                className="text-muted-foreground text-xs hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Limpar
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => fetchAgendamentos(senhaArmazenada)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-card text-foreground text-sm hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Atualizando..." : "Atualizar lista"}
          </button>
          <span className="text-muted-foreground text-xs">
            {agendamentosFiltrados.length} de {agendamentos.length} agendamentos
          </span>
        </div>

        {agendamentosFiltrados.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="space-y-3">
            {agendamentosFiltrados.map((a, i) => (
              <div key={a.id} style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }} className="card-anim bg-card rounded-xl p-4 border border-border flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gold font-bold text-sm">{a.dia}</span>
                    <span className="text-foreground font-bold text-sm">{a.horario}</span>
                    {a.obs?.includes("Plano Mensal") && (
                      <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full">
                        📋 PLANO MENSAL
                      </span>
                    )}
                  </div>
                  <p className="text-foreground text-sm"><strong>Cliente:</strong> {a.nome}</p>
                  <p className="text-muted-foreground text-xs">Tel: {a.telefone}</p>

                  {editingId === a.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={editServico}
                        onChange={(e) => setEditServico(e.target.value)}
                        className="bg-background text-foreground text-xs rounded-lg px-2 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {SERVICOS.map((s) => (
                          <option key={s.id} value={s.nome}>{s.nome} — {s.preco}</option>
                        ))}
                      </select>
                      <button onClick={() => handleEditSave(a.id)} className="text-green-500 hover:text-green-400 p-1">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs">
                      Serviço: {a.servico} | Barbeiro: {a.barbeiro}
                      <button onClick={() => handleEditStart(a)} className="ml-2 text-gold hover:text-gold/80 inline-flex items-center gap-0.5">
                        <Pencil className="w-3 h-3" />
                      </button>
                    </p>
                  )}

                  {a.obs && <p className="text-muted-foreground text-xs">OBS: {a.obs}</p>}

                  <button
                    onClick={() => enviarLembrete(a)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-gold text-primary-foreground text-xs font-bold"
                    title="Abrir WhatsApp com a mensagem de lembrete pronta"
                  >
                    <BellRing className="w-3.5 h-3.5" /> Enviar lembrete
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors p-2"
                  title="Cancelar agendamento e liberar horário"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
