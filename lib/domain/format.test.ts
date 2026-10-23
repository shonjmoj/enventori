import { describe, expect, it } from "vitest";
import { getMessages } from "@/lib/i18n/messages";
import { createFormatter } from "./format";

const format = createFormatter("fr-FR", "Europe/Paris", getMessages("fr-FR"));

describe("formatter", () => {
  it("handles the end of daylight saving time (25 Oct 2026)", () => {
    expect(format.time("2026-10-24T15:15:00Z")).toBe("17h15"); // CEST, UTC+2
    expect(format.time("2026-10-25T16:15:00Z")).toBe("17h15"); // CET, UTC+1
  });

  it("shows venue time, with a home-time hint abroad", () => {
    const lisbon = "2026-11-04T20:00:00Z";
    expect(format.time(lisbon, "Europe/Lisbon")).toBe("20h00");
    expect(format.homeTimeHint(lisbon, "Europe/Lisbon")).toBe("21h00 à Paris");
    expect(format.homeTimeHint(lisbon, "Europe/Paris")).toBeNull();
  });

  it("relative day only within the coming week", () => {
    const now = new Date("2026-10-24T08:00:00Z");
    expect(format.relativeDay("2026-10-24T18:00:00Z", now)).toBe("Aujourd’hui");
    expect(format.relativeDay("2026-10-25T16:15:00Z", now)).toBe("Demain");
    expect(format.relativeDay("2026-10-28T20:00:00Z", now)).toBe("Dans 4 jours");
    expect(format.relativeDay("2026-11-08T16:15:00Z", now)).toBeNull();
  });

  it("dates and months in French", () => {
    expect(format.longDate("2026-10-25T16:15:00Z")).toBe("Dimanche 25 octobre");
    expect(format.monthLabel("2026-11-08T16:15:00Z")).toBe("Novembre 2026");
    expect(format.shortDateTime("2026-11-02T09:00:00Z")).toBe("2 nov. à 10h00");
  });

  it("prices from minor units, decimals only when needed", () => {
    expect(format.price({ amount: 1200, currency: "EUR" })).toBe("12 €");
    expect(format.price({ amount: 1250, currency: "EUR" })).toBe("12,50 €");
    expect(format.price({ amount: 1200, currency: "JPY" })).toBe("1 200 JPY");
  });
});
