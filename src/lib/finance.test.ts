import { describe, it, expect } from "vitest";
import { appointmentValue, financeSummary, customersCsv, customerGroups, isMonthlyPlan, type Appointment } from "./admin";
import { googleCalendarLink, icsFile } from "./calendar";
const services = [{ nome: "Corte", valor: 35 }, { nome: "Barba", valor: 25 }];
const base: Appointment & { status?: string } = { id: "1", nome: "Ana", telefone: "15999999999", servico: "Corte, Barba", barbeiro: "kauan", dia: "2026-11-03", horario: "14:00", obs: "", created_at: "" };
describe("finance and exports", () => {
  it("sums combined services", () => expect(appointmentValue("Corte, Barba", services)).toBe(60));
  it("ignores cancelled appointments in revenue", () => {
    const s = financeSummary([base, { ...base, id: "2", status: "cancelado" }], services, "2026-11-01", "2026-11-30");
    expect(s.total).toBe(60); expect(s.atendimentos).toBe(1);
  });
  it("excludes appointments outside the period", () => expect(financeSummary([base], services, "2026-12-01", "2026-12-31").total).toBe(0));
  it("detects monthly plan from notes", () => expect(isMonthlyPlan({ obs: "x | Plano Mensal", servico: "Corte" })).toBe(true));
  it("exports customers with phone", () => expect(customersCsv(customerGroups([base]))).toContain('"15999999999"'));
  it("calendar event lasts one hour from booking", () => expect(googleCalendarLink(base)).toContain("20261103T140000/20261103T150000"));
  it("ics reminds one hour before", () => expect(icsFile(base)).toContain("TRIGGER:-PT1H"));
});
