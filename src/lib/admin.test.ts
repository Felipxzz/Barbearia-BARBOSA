import { describe, it, expect } from "vitest";
import { customerGroups, localDay, reminderLink, type Appointment } from "./admin";
import { initialCatalog } from "@/hooks/use-catalog";
const appointment: Appointment = { id: "one", nome: "Cliente", telefone: "15999999999", servico: "Corte", barbeiro: "kauan", dia: "2026-10-22", horario: "14:00", obs: "", created_at: "2026-10-21" };
describe("Barbosa administration", () => {
  it("derives customers from appointment phone without a profile", () => {
    expect(customerGroups([appointment, { ...appointment, id: "two", telefone: "(15) 99999-9999" }])).toHaveLength(1);
  });
  it("retains Kauan individual WhatsApp destination", () => {
    expect(initialCatalog.barbeiros.find(b => b.id === "kauan")?.whatsapp).toBe("15997451750");
  });
  it("retains Ryan individual WhatsApp destination", () => {
    expect(initialCatalog.barbeiros.find(b => b.id === "ryan")?.whatsapp).toBe("15991566902");
  });
  it("addresses customer reminders rather than a barber", () => {
    expect(reminderLink(appointment).split("?")[0]).toBe("https://wa.me/5515999999999");
  });
  it("uses local calendar day for agenda filters", () => {
    expect(localDay(new Date(2026, 9, 21, 23, 59))).toBe("2026-10-21");
  });
});