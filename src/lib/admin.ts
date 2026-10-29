export interface Appointment {
  id: string; nome: string; telefone: string; servico: string; barbeiro: string;
  dia: string; horario: string; obs: string | null; created_at: string;
}
export const localDay = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const normalizePhone = (phone: string) => phone.replace(/\D/g, "");
export const customerGroups = (appointments: Appointment[]) => {
  const groups = new Map<string, { nome: string; telefone: string; appointments: Appointment[] }>();
  for (const appointment of appointments) {
    const key = normalizePhone(appointment.telefone);
    const group = groups.get(key) ?? { nome: appointment.nome, telefone: appointment.telefone, appointments: [] };
    group.appointments.push(appointment);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
};
export const reminderLink = (a: Appointment) => {
  const phone = normalizePhone(a.telefone);
  const when = a.dia === localDay() ? "hoje" : `em ${a.dia.split("-").reverse().join("/")}`;
  const text = `Barbearia Barbosa\n──────────────\nOlá, ${a.nome}! Tudo bem?\n\nEste é um lembrete do seu agendamento ${when}, às ${a.horario}h, com ${a.barbeiro}.\nServiço: ${a.servico}\n\nPedimos a gentileza de confirmar sua presença respondendo esta mensagem. Caso precise remarcar ou cancelar, avise-nos com antecedência.\n\nAgradecemos a preferência!\nBarbearia Barbosa`;
  return `https://wa.me/${phone.length <= 11 ? `55${phone}` : phone}?text=${encodeURIComponent(text)}`;
};
export interface PricedService { nome: string; valor: number }
/** Sum of catalog prices for the comma-separated service names stored on an appointment. */
export const appointmentValue = (servico: string, services: PricedService[]) =>
  servico.split(",").map(s => s.trim()).reduce((sum, nome) => sum + (services.find(s => s.nome === nome)?.valor ?? 0), 0);
export const isMonthlyPlan = (a: Pick<Appointment, "obs" | "servico">) => /plano mensal/i.test(`${a.obs ?? ""} ${a.servico}`);
export const financeSummary = (appointments: (Appointment & { status?: string })[], services: PricedService[], from: string, to: string) => {
  const done = appointments.filter(a => a.status !== "cancelado" && a.dia >= from && a.dia <= to);
  const byBarber = new Map<string, { cortes: number; total: number }>();
  const byService = new Map<string, number>();
  let total = 0;
  for (const a of done) {
    const value = appointmentValue(a.servico, services);
    total += value;
    const b = byBarber.get(a.barbeiro) ?? { cortes: 0, total: 0 };
    b.cortes += 1; b.total += value; byBarber.set(a.barbeiro, b);
    for (const s of a.servico.split(",").map(x => x.trim()).filter(Boolean)) byService.set(s, (byService.get(s) ?? 0) + 1);
  }
  return {
    total, atendimentos: done.length, ticketMedio: done.length ? total / done.length : 0,
    porBarbeiro: [...byBarber.entries()].map(([barbeiro, v]) => ({ barbeiro, ...v })),
    servicos: [...byService.entries()].map(([nome, qtd]) => ({ nome, qtd })).sort((a, b) => b.qtd - a.qtd),
  };
};
const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
export const customersCsv = (groups: ReturnType<typeof customerGroups>) =>
  "\uFEFF" + [["Nome", "Telefone", "Agendamentos", "Último horário"], ...groups.map(g => {
    const last = g.appointments.reduce((m, a) => (a.dia > m ? a.dia : m), "");
    return [g.nome, g.telefone, g.appointments.length, last.split("-").reverse().join("/")];
  })].map(r => r.map(csvCell).join(";")).join("\r\n");
