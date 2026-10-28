import { describe, expect, it } from "vitest";
import { availableHours, monthlyDates, validCustomer } from "./booking";
import { whatsappLink } from "@/data/barbearia";
describe("Booking rules", () => {
  it("routes contact WhatsApp to the Brazilian destination", () => expect(whatsappLink("15991566902", "Olá")).toBe("https://wa.me/5515991566902?text=Ol%C3%A1"));
  it("books only remaining monthly weeks from the selected day", () => expect(monthlyDates("2026-10-27")).toEqual(["2026-10-27"]));
  it("retains weekly dates through month end", () => expect(monthlyDates("2026-10-13")).toEqual(["2026-10-13", "2026-10-20", "2026-10-27"]));
  it("opens Tuesday through Friday from 14 to 19", () => expect(availableHours("2026-10-28", new Date(2026,9,27))).toEqual(["14:00","15:00","16:00","17:00","18:00","19:00"]));
  it("opens Saturday from 08 to 19", () => expect(availableHours("2026-10-31", new Date(2026,9,27))).toEqual(["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"]));
  it("closes Sunday and Monday", () => { expect(availableHours("2026-11-01")).toEqual([]); expect(availableHours("2026-11-02")).toEqual([]); });
  it("excludes elapsed same-day slots", () => expect(availableHours("2026-10-27",new Date(2026,9,27,16,30))).toEqual(["17:00","18:00","19:00"]));
  it("allows accented letters and rejects numbers and symbols", () => { expect(validCustomer("João Silva","15999999999")).toBe(true); expect(validCustomer("João2","15999999999")).toBe(false); expect(validCustomer("João@","15999999999")).toBe(false); });
  it("requires numeric phone of valid length", () => { expect(validCustomer("João","123")).toBe(false); expect(validCustomer("João","1599999999a")).toBe(false); });
});