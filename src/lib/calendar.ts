import { CONTATO } from "@/data/barbearia";
const stamp = (dia: string, horario: string, addHours = 0) => {
  const [h] = horario.split(":").map(Number);
  return `${dia.replace(/-/g, "")}T${String(h + addHours).padStart(2, "0")}0000`;
};
export interface CalendarItem { servico: string; barbeiro: string; dia: string; horario: string }
export const googleCalendarLink = (i: CalendarItem) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Barbearia Barbosa · ${i.servico}`)}&dates=${stamp(i.dia, i.horario)}/${stamp(i.dia, i.horario, 1)}&ctz=America/Sao_Paulo&details=${encodeURIComponent(`Com ${i.barbeiro}`)}&location=${encodeURIComponent(CONTATO.endereco)}`;
export const icsFile = (i: CalendarItem) => [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Barbearia Barbosa//PT", "BEGIN:VEVENT",
  `UID:${i.dia}-${i.horario}-${i.barbeiro}@barbosa`, `DTSTART;TZID=America/Sao_Paulo:${stamp(i.dia, i.horario)}`, `DTEND;TZID=America/Sao_Paulo:${stamp(i.dia, i.horario, 1)}`,
  `SUMMARY:Barbearia Barbosa - ${i.servico}`, `DESCRIPTION:Com ${i.barbeiro}`, `LOCATION:${CONTATO.endereco.replace(/,/g, "\\,")}`,
  "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", "DESCRIPTION:Seu horário na Barbosa é em 1 hora", "END:VALARM",
  "END:VEVENT", "END:VCALENDAR"].join("\r\n");
export const download = (name: string, content: string | Blob, type = "text/plain") => {
  const url = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
