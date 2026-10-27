import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarDays, Users, Scissors, UserRound, LogOut, LockKeyhole, ArrowUpRight, Search, RefreshCw, BellRing, Pencil, Trash2, Clock, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CatalogManager from "@/components/admin/CatalogManager";
import { useCatalog, type Catalog } from "@/hooks/use-catalog";
import { localDay, customerGroups, reminderLink, normalizePhone, type Appointment } from "@/lib/admin";
import "@/styles/barbosa.css";

type View = "agenda" | "clientes" | "servicos" | "barbeiros";
const views = [{ id: "agenda", label: "Agenda", icon: CalendarDays }, { id: "clientes", label: "Clientes", icon: Users }, { id: "servicos", label: "Serviços", icon: Scissors }, { id: "barbeiros", label: "Profissionais", icon: UserRound }] as const;
const formatDay = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export default function Admin() {
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [busy, setBusy] = useState(false);
  const [agendaLoading, setAgendaLoading] = useState(false);
  const activeCredential = useRef("");
  const [errorText, setErrorText] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<View>("agenda");
  const [search, setSearch] = useState("");
  const [barber, setBarber] = useState("");
  const [day, setDay] = useState("");
  const [scope, setScope] = useState("proximos");
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [cancel, setCancel] = useState<Appointment | null>(null);
  const [customer, setCustomer] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const { catalog } = useCatalog(Boolean(credential));
  const queryClient = useQueryClient();
  useEffect(() => {
    const font = document.createElement("link"); font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;600;700;800&display=swap";
    const meta = document.createElement("meta"); meta.name = "robots"; meta.content = "noindex, nofollow";
    document.head.append(font, meta);
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => { font.remove(); meta.remove(); clearInterval(timer); };
  }, []);
  const invoke = useCallback(async (body: Record<string, unknown>) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let result;
    try {
      result = await supabase.functions.invoke("admin-agendamentos", { body, signal: controller.signal });
      if (controller.signal.aborted) throw new Error("A conexão demorou demais. Tente novamente.");
    } catch (error) {
      if (controller.signal.aborted) throw new Error("A conexão demorou demais. Tente novamente.");
      throw error;
    } finally { clearTimeout(timer); }
    const { data, error } = result;
    let message = data?.error;
    if (error && !message) {
      try { message = (await (error as { context?: Response }).context?.json())?.error; } catch { /* use connection message */ }
    }
    if (error || message) throw new Error(message || "Não foi possível conectar. Tente novamente.");
    return data;
  }, []);
  const load = async (pass = credential) => {
    if (!pass || activeCredential.current !== pass) return;
    setAgendaLoading(true); setErrorText("");
    try { const data = await invoke({ password: pass, action: "list" }); if (activeCredential.current === pass) setAppointments(data.data ?? []); }
    catch (error) { if (activeCredential.current !== pass) return; const message = error instanceof Error ? error.message : "Erro ao carregar agenda"; setErrorText(message); toast.error(message); }
    finally { if (activeCredential.current === pass) setAgendaLoading(false); }
  };
  const login = async (pass: string) => {
    setBusy(true); setErrorText("");
    try {
      await invoke({ password: pass, action: "login-check" });
      activeCredential.current = pass; setCredential(pass); setPassword("");
      void load(pass);
    } catch (error) { const message = error instanceof Error ? error.message : "Não foi possível acessar o painel."; setErrorText(message); toast.error(message); }
    finally { setBusy(false); }
  };
  const saveCatalog = async (next: Catalog) => {
    setBusy(true);
    try { await invoke({ password: credential, action: "catalog-save", catalog: next }); queryClient.setQueryData(["barbosa-catalog"], next); await queryClient.invalidateQueries({ queryKey: ["barbosa-catalog"] }); toast.success("Alterações salvas no painel e na área dos clientes."); return true; }
    catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao salvar"); return false; }
    finally { setBusy(false); }
  };
  const saveAppointment = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const { id, nome, telefone, servico, barbeiro, dia, horario, obs } = editing;
      await invoke({ password: credential, action: "update", id, updates: { nome, telefone, servico, barbeiro, dia, horario, obs: obs ?? "" } });
      setAppointments(prev => prev.map(a => a.id === id ? editing : a)); setEditing(null); toast.success("Agendamento atualizado.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao atualizar"); }
    finally { setBusy(false); }
  };
  const deleteAppointment = async () => {
    if (!cancel) return;
    setBusy(true);
    try { await invoke({ password: credential, action: "delete", id: cancel.id }); setAppointments(prev => prev.filter(a => a.id !== cancel.id)); setCancel(null); toast.success("Agendamento cancelado e horário liberado."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Erro ao cancelar"); }
    finally { setBusy(false); }
  };
  const today = localDay(now);
  const clients = useMemo(() => customerGroups(appointments), [appointments]);
  const filtered = appointments.filter(a => (scope === "todos" || a.dia >= today) && (!day || a.dia === day) && (!barber || a.barbeiro.toLowerCase() === barber.toLowerCase()) && `${a.nome} ${a.telefone}`.toLowerCase().includes(search.toLowerCase()));
  const reminders = appointments.filter(a => { const minutes = (new Date(`${a.dia}T${a.horario}:00`).getTime() - now.getTime()) / 60000; return minutes >= 0 && minutes <= 60; });
  const selectedCustomer = clients.find(c => normalizePhone(c.telefone) === customer);
  const barberName = (id: string) => catalog.barbeiros.find(b => b.id === id)?.nome ?? id;
  const remind = (a: Appointment) => reminderLink({ ...a, barbeiro: barberName(a.barbeiro) });
  const logout = () => { activeCredential.current = ""; setAgendaLoading(false); setCredential(""); setPassword(""); setAppointments([]); setSearch(""); setEditing(null); setCustomer(null); setCancel(null); };

  if (!credential) return <main className="barbosa-site barbosa-admin admin-login">
    <a className="admin-login-brand barbosa-wordmark" href="/"><span>BARBOSA</span><small>BARBEARIA</small></a>
    <form className="admin-login-form card-anim" onSubmit={e => { e.preventDefault(); if (password.trim() && !busy) void login(password.trim()); }}>
      <div className="admin-item-icon mb-6"><LockKeyhole /></div><span className="barbosa-eyebrow">ÁREA ADMINISTRATIVA</span><h1 className="mt-3 mb-3">Bem-vindo à Barbosa.</h1><p className="text-muted-foreground text-sm mb-8">Acesso restrito à administração.</p>
      <div className="admin-form"><label>Senha de administrador<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Digite sua senha" /></label></div>
      {errorText && <p role="alert" className="text-destructive text-sm mt-3">{errorText}</p>}
      <Button className="w-full mt-5" type="submit" disabled={busy}>{busy ? "Verificando…" : "Entrar no painel"}<ArrowUpRight /></Button><Button variant="link" asChild className="w-full mt-3"><a href="/">Voltar ao site</a></Button>
    </form><p className="admin-login-footer">BARBEARIA BARBOSA · ADMINISTRAÇÃO</p>
  </main>;

  return <div className="barbosa-site barbosa-admin admin-shell">
    <aside className="admin-sidebar"><a href="/" className="barbosa-wordmark"><span>BARBOSA</span><small>ADMINISTRAÇÃO</small></a><div className="admin-nav-label">GERENCIAMENTO</div><nav aria-label="Menu administrativo">{views.map(v => <Button key={v.id} variant="ghost" className={`admin-nav-button ${view === v.id ? "admin-nav-active" : ""}`} onClick={() => { setView(v.id); setSearch(""); }}><v.icon />{v.label}</Button>)}</nav><div className="admin-sidebar-bottom"><Button asChild variant="outline"><a href="/" target="_blank" rel="noopener noreferrer">Área dos clientes<ArrowUpRight /></a></Button><Button variant="ghost" onClick={logout}><LogOut />Sair do painel</Button></div></aside>
    <div className="admin-main"><header className="admin-topbar"><div><span className="barbosa-eyebrow">BARBEARIA BARBOSA</span><h1>{views.find(v => v.id === view)?.label}</h1></div><div className="flex items-center gap-3"><span className="admin-date text-xs text-muted-foreground">{now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</span><Button variant="outline" size="icon" title="Atualizar agenda" aria-label="Atualizar agenda" disabled={busy} onClick={() => void load()}><RefreshCw className={busy ? "animate-spin" : ""} /></Button><Button variant="ghost" size="icon" className="lg:hidden" title="Sair do painel" aria-label="Sair do painel" onClick={logout}><LogOut /></Button></div></header>
    <main className="admin-content">
      {agendaLoading && <p role="status" className="text-muted-foreground text-sm mb-4 flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" />Carregando agenda…</p>}
      {errorText && <p role="alert" className="text-destructive text-sm mb-4">{errorText}</p>}
      <div className="admin-stats">{[{ title: "Agendamentos hoje", value: appointments.filter(a => a.dia === today).length, icon: CalendarDays }, { title: "Próximos horários", value: appointments.filter(a => a.dia >= today).length, icon: Clock }, { title: "Clientes atendidos", value: clients.length, icon: Users }, { title: "Profissionais ativos", value: catalog.barbeiros.filter(b => b.ativo !== false).length, icon: Scissors }].map(stat => <article className="admin-stat barbosa-card card-anim" key={stat.title}><div className="flex justify-between gap-3"><span>{stat.title}</span><stat.icon className="text-primary w-5 h-5" /></div><strong>{stat.value.toString().padStart(2, "0")}</strong></article>)}</div>
      {view === "agenda" && <>
        {reminders.length > 0 && <section className="admin-reminders"><div className="flex items-center gap-2 font-semibold text-primary text-sm"><BellRing className="w-4 h-4" />Confirmações · próxima hora</div>{reminders.map(a => <div key={a.id} className="admin-reminder-row"><div><strong className="text-sm">{a.nome}</strong><p className="text-xs text-muted-foreground">{a.horario} · {barberName(a.barbeiro)}</p></div><Button asChild size="sm"><a href={remind(a)} target="_blank" rel="noopener noreferrer"><BellRing />Enviar lembrete</a></Button></div>)}</section>}
        <div className="admin-section-title"><div><h2>Agenda da barbearia</h2><p className="text-sm text-muted-foreground">{filtered.length} agendamentos</p></div><div className="admin-segment"><Button size="sm" variant={scope === "proximos" ? "default" : "ghost"} onClick={() => setScope("proximos")}>Próximos</Button><Button size="sm" variant={scope === "todos" ? "default" : "ghost"} onClick={() => setScope("todos")}>Histórico completo</Button></div></div>
        <div className="admin-filters"><label className="admin-search"><Search /><input aria-label="Buscar cliente" placeholder="Buscar nome ou telefone" value={search} onChange={e => setSearch(e.target.value)} /></label><select aria-label="Filtrar profissional" value={barber} onChange={e => setBarber(e.target.value)}><option value="">Todos os profissionais</option>{catalog.barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}</select><input aria-label="Filtrar data" type="date" value={day} onChange={e => setDay(e.target.value)} />{(day || barber || search) && <Button variant="ghost" size="icon" aria-label="Limpar filtros" title="Limpar filtros" onClick={() => { setDay(""); setBarber(""); setSearch(""); }}><X /></Button>}</div>
        <div className="admin-agenda-list">{filtered.length === 0 ? <div className="admin-empty"><CalendarDays /><h3>Nenhum agendamento</h3><p>Não há horários para os filtros selecionados.</p></div> : filtered.map(a => <article key={a.id} className="admin-appointment card-anim"><div className="admin-appointment-time"><strong>{a.horario}</strong><span>{formatDay(a.dia)}</span></div><div className="admin-appointment-info"><h3>{a.nome}</h3><p>{a.servico} · {barberName(a.barbeiro)}</p><small>{a.telefone}</small>{a.obs && <small className="block mt-1">{a.obs}</small>}</div><div className="admin-appointment-actions"><Button asChild variant="outline" size="sm"><a href={remind(a)} target="_blank" rel="noopener noreferrer"><BellRing />Lembrete</a></Button><Button variant="ghost" size="icon" aria-label={`Editar agendamento de ${a.nome}`} title="Editar agendamento" onClick={() => setEditing({ ...a })}><Pencil /></Button><Button variant="ghost" size="icon" className="text-destructive" aria-label={`Cancelar agendamento de ${a.nome}`} title="Cancelar agendamento" onClick={() => setCancel(a)}><Trash2 /></Button></div></article>)}</div>
      </>}
      {view === "clientes" && <><div className="admin-section-title"><div><h2>Clientes da Barbosa</h2><p className="text-sm text-muted-foreground">{clients.length} clientes na agenda</p></div><label className="admin-search"><Search /><input aria-label="Buscar na lista de clientes" placeholder="Buscar nome ou telefone" value={search} onChange={e => setSearch(e.target.value)} /></label></div><div className="admin-catalog-grid">{clients.filter(c => `${c.nome} ${c.telefone}`.toLowerCase().includes(search.toLowerCase())).map(c => <article key={normalizePhone(c.telefone)} className="admin-catalog-item barbosa-card card-anim"><div className="admin-item-icon"><UserRound /></div><h3 className="mt-4">{c.nome}</h3><p className="text-sm text-muted-foreground mt-1">{c.telefone}</p><p className="text-xs text-muted-foreground mt-4">{c.appointments.length} agendamentos</p><Button variant="outline" className="w-full mt-4" onClick={() => setCustomer(normalizePhone(c.telefone))}>Ver histórico<ArrowUpRight /></Button></article>)}</div>{clients.length === 0 && <div className="admin-empty"><Users /><h3>Nenhum cliente na agenda</h3></div>}</>}
      {(view === "servicos" || view === "barbeiros") && <CatalogManager key={view} kind={view} catalog={catalog} save={saveCatalog} busy={busy} />}
    </main><footer className="admin-content-footer">BARBOSA · PAINEL ADMINISTRATIVO<Button asChild variant="link" size="sm"><a href="/">Área dos clientes<ArrowUpRight /></a></Button></footer></div>
    <Dialog open={!!editing} onOpenChange={open => { if (!open) setEditing(null); }}><DialogContent className="barbosa-site barbosa-admin admin-dialog"><DialogHeader><DialogTitle>Editar agendamento</DialogTitle><DialogDescription>{editing?.nome}</DialogDescription></DialogHeader>{editing && <div className="admin-form"><label>Nome<input value={editing.nome} onChange={e => setEditing({ ...editing, nome: e.target.value.replace(/[0-9]/g, "") })} /></label><label>Telefone<input inputMode="numeric" value={editing.telefone} onChange={e => setEditing({ ...editing, telefone: e.target.value.replace(/\D/g, "") })} /></label><label>Serviço<select value={editing.servico} onChange={e => setEditing({ ...editing, servico: e.target.value })}><option value={editing.servico}>{editing.servico}</option>{catalog.servicos.filter(s => s.ativo !== false && s.nome !== editing.servico).map(s => <option key={s.id} value={s.nome}>{s.nome} · {s.preco}</option>)}</select></label><label>Profissional<select value={editing.barbeiro} onChange={e => setEditing({ ...editing, barbeiro: e.target.value })}>{!catalog.barbeiros.some(b => b.id === editing.barbeiro) && <option value={editing.barbeiro}>{editing.barbeiro}</option>}{catalog.barbeiros.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label>Data<input type="date" value={editing.dia} onChange={e => setEditing({ ...editing, dia: e.target.value })} /></label><label>Horário<select value={editing.horario} onChange={e => setEditing({ ...editing, horario: e.target.value })}>{Array.from({ length: 12 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`).map(h => <option key={h}>{h}</option>)}</select></label></div><label>Observações<textarea rows={2} value={editing.obs ?? ""} onChange={e => setEditing({ ...editing, obs: e.target.value })} /></label><Button onClick={saveAppointment} disabled={busy}><Save />{busy ? "Salvando…" : "Salvar agendamento"}</Button></div>}</DialogContent></Dialog>
    <Dialog open={!!cancel} onOpenChange={open => { if (!open) setCancel(null); }}><DialogContent className="barbosa-site barbosa-admin admin-dialog"><DialogHeader><DialogTitle>Cancelar agendamento?</DialogTitle><DialogDescription>{cancel?.nome} · {cancel?.horario} · {cancel ? formatDay(cancel.dia) : ""}. O horário será liberado.</DialogDescription></DialogHeader><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setCancel(null)}>Manter agendamento</Button><Button variant="destructive" disabled={busy} onClick={deleteAppointment}><Trash2 />{busy ? "Cancelando…" : "Confirmar cancelamento"}</Button></div></DialogContent></Dialog>
    <Dialog open={!!selectedCustomer} onOpenChange={open => { if (!open) setCustomer(null); }}><DialogContent className="barbosa-site barbosa-admin admin-dialog"><DialogHeader><DialogTitle>{selectedCustomer?.nome}</DialogTitle><DialogDescription>{selectedCustomer?.telefone} · Histórico de agendamentos</DialogDescription></DialogHeader><div className="space-y-3">{selectedCustomer?.appointments.slice().reverse().map(a => <div key={a.id} className="border-b border-border pb-3"><strong className="text-sm">{formatDay(a.dia)} · {a.horario}</strong><p className="text-xs text-muted-foreground mt-1">{a.servico} · {barberName(a.barbeiro)}</p></div>)}</div></DialogContent></Dialog>
  </div>;
}
