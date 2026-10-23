import type { TicketEvent } from "@/lib/api/schema";

export type SaleState =
  /** `isSoldOut` is refreshed every ~10 min: keep a path to the event page. */
  | { kind: "soldOut" }
  /** Tickets can be bought now; `presale` is set while only an audience can buy. */
  | { kind: "onSale"; presale: { audience: string; endsAt: string } | null }
  | { kind: "presaleSoon"; audience: string; startsAt: string; publicSaleAt: string | null }
  | { kind: "opensAt"; at: string }
  | { kind: "notAnnounced" };

export function getSaleState(event: TicketEvent, now: Date): SaleState {
  const t = now.getTime();
  const { presale } = event;

  if (event.isSoldOut) return { kind: "soldOut" };

  if (event.isOnSale) {
    const presaleRunning =
      presale !== null && Date.parse(presale.startsAt) <= t && t < Date.parse(presale.endsAt);
    return {
      kind: "onSale",
      presale: presaleRunning ? { audience: presale.audience, endsAt: presale.endsAt } : null,
    };
  }

  if (presale && t < Date.parse(presale.startsAt)) {
    return {
      kind: "presaleSoon",
      audience: presale.audience,
      startsAt: presale.startsAt,
      publicSaleAt: event.onSaleAt,
    };
  }

  if (event.onSaleAt && t < Date.parse(event.onSaleAt)) {
    return { kind: "opensAt", at: event.onSaleAt };
  }

  return { kind: "notAnnounced" };
}

export function canBook(state: SaleState): boolean {
  return state.kind === "onSale";
}
