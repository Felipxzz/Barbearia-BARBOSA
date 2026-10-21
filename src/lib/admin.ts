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