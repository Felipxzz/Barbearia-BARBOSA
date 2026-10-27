import { localDay } from "./admin";

export const monthlyDates = (selected: string) => {
  const date = new Date(`${selected}T12:00:00`);
  const month = date.getMonth();
  const dates: string[] = [];
  while (date.getMonth() === month) {
    dates.push(localDay(date));
    date.setDate(date.getDate() + 7);
  }
  return dates;
};
export const availableHours = (day: string, now = new Date()) => {
  const weekday = new Date(`${day}T12:00:00`).getDay();
  if (weekday === 0 || weekday === 1) return [];
  return Array.from({ length: weekday === 6 ? 12 : 6 }, (_, i) => `${String(i + (weekday === 6 ? 8 : 14)).padStart(2, "0")}:00`)
    .filter(hour => new Date(`${day}T${hour}:00`) > now);
};
export const validCustomer = (name: string, phone: string) => /^[\p{L} ]{2,80}$/u.test(name.trim()) && /^\d{10,13}$/.test(phone);