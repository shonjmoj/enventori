import { describe, expect, it } from "vitest";
import { loadClub } from "@/lib/test-fixtures";
import { parseHomePage } from "./home-page";

describe("home page parsing", () => {
  it("parses the three club snapshots", () => {
    for (const slug of ["rivemont", "port-vallon", "brehaut"]) {
      expect(loadClub(slug).tenant.slug).toBe(slug);
    }
  });

  it("keeps unknown block types as explicit 'unknown' entries", () => {
    const page = loadClub("port-vallon");
    const raw = JSON.parse(JSON.stringify(page));
    raw.blocks.push({ type: "countdown", id: "blk-x", target: "2026-12-01" });
    const parsed = parseHomePage(raw);
    expect(parsed.blocks.at(-1)).toEqual({ type: "unknown", id: "blk-x", rawType: "countdown" });
  });

  it("drops a broken event or block instead of failing the page", () => {
    const raw = JSON.parse(JSON.stringify(loadClub("rivemont")));
    raw.events.push({ id: "999", kind: "MATCH" }); // no dates, no urls
    raw.blocks.push({ type: "promo", id: "blk-bad" }); // known type, missing title is fine…
    raw.blocks.push({ type: "newsletter", id: "blk-bad-2" }); // …but a newsletter needs its CTA
    const parsed = parseHomePage(raw);
    expect(parsed.events.find((e) => e.id === "999")).toBeUndefined();
    expect(parsed.blocks.find((b) => b.id === "blk-bad-2")).toBeUndefined();
  });

  it("degrades invalid brand colours and time zones to null", () => {
    const raw = JSON.parse(JSON.stringify(loadClub("brehaut")));
    raw.tenant.brand = { primary: "lime", secondary: "#12" };
    raw.events[0].venue.timeZone = "Mars/Olympus_Mons";
    const parsed = parseHomePage(raw);
    expect(parsed.tenant.brand).toEqual({ primary: null, secondary: null });
    expect(parsed.events[0].venue?.timeZone).toBeNull();
  });

  it("keeps positive prices only", () => {
    const raw = JSON.parse(JSON.stringify(loadClub("rivemont")));
    raw.events[1].priceFrom = { amount: 0, currency: "EUR" };
    raw.events[2].priceFrom = { amount: 1500, currency: "euros" };
    const parsed = parseHomePage(raw);
    expect(parsed.events[0].priceFrom).toEqual({ amount: 1200, currency: "EUR" });
    expect(parsed.events[1].priceFrom).toBeNull();
    expect(parsed.events[2].priceFrom).toBeNull();
  });

  it("keeps partners whose logo is missing", () => {
    const partners = loadClub("port-vallon").blocks.find((b) => b.type === "partners");
    expect(partners?.type === "partners" && partners.partners.filter((p) => !p.logoUrl)).toHaveLength(3);
  });
});
