import { describe, expect, it } from "vitest";
import { loadClub } from "@/lib/test-fixtures";
import { getSaleState } from "./sale-state";

const page = loadClub("port-vallon");
const now = new Date(page.snapshotAt);
const state = (id: string) => getSaleState(page.events.find((e) => e.id === id)!, now);

describe("getSaleState", () => {
  it("sold out wins over on sale", () => {
    expect(state("908")).toEqual({ kind: "soldOut" });
  });

  it("on sale during a running members presale", () => {
    expect(state("903")).toEqual({
      kind: "onSale",
      presale: { audience: "MEMBERS", endsAt: "2026-10-27T22:00:00Z" },
    });
  });

  it("plain on sale", () => {
    expect(state("904")).toEqual({ kind: "onSale", presale: null });
  });

  it("presale not open yet, with the public date", () => {
    expect(state("906")).toEqual({
      kind: "presaleSoon",
      audience: "MEMBERS",
      startsAt: "2026-10-26T08:00:00Z",
      publicSaleAt: "2026-11-02T08:00:00Z",
    });
  });

  it("announced public sale", () => {
    expect(state("912")).toEqual({ kind: "opensAt", at: "2026-12-15T08:00:00Z" });
  });

  it("nothing announced", () => {
    expect(state("916")).toEqual({ kind: "notAnnounced" });
  });
});
