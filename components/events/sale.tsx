import { eventName } from "@/lib/domain/events";
import { getSaleState, type SaleState } from "@/lib/domain/sale-state";
import { audienceLabel } from "@/lib/i18n/messages";
import type { PageContext } from "@/lib/page-context";
import { buttonStyles } from "@/components/ui/smart-link";
import Link from "next/link";
import type { EventCtaProps, Surface, Tone } from "./types";

/** Says *why* an event can or can't be booked, not just that it can't. */
export function describeSale(state: SaleState, ctx: PageContext): { label: string; tone: Tone } {
  const { sale } = ctx.messages;
  const { format, messages } = ctx;

  switch (state.kind) {
    case "soldOut":
      return { label: sale.soldOut, tone: "negative" };
    case "onSale":
      return state.presale
        ? {
            label: sale.presaleOpen(
              audienceLabel(messages, state.presale.audience),
              format.shortDateTime(state.presale.endsAt),
            ),
            tone: "positive",
          }
        : { label: sale.onSale, tone: "positive" };
    case "presaleSoon": {
      const presale = sale.presaleSoon(
        audienceLabel(messages, state.audience),
        format.shortDateTime(state.startsAt),
      );
      return {
        label: state.publicSaleAt
          ? `${presale}, ${sale.publicSale(format.shortDate(state.publicSaleAt))}`
          : presale,
        tone: "pending",
      };
    }
    case "opensAt":
      return { label: sale.opensAt(format.shortDateTime(state.at)), tone: "pending" };
    case "notAnnounced":
      return { label: sale.notAnnounced, tone: "pending" };
  }
}

const dotTone: Record<Tone, string> = {
  positive: "bg-positive",
  negative: "bg-negative",
  pending: "bg-current opacity-40",
};

export function SaleStatus({ state, ctx }: { state: SaleState; ctx: PageContext }) {
  const { label, tone } = describeSale(state, ctx);
  return (
    <p className="flex items-baseline gap-2 text-sm font-medium leading-snug">
      <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${dotTone[tone]}`} />
      <span>{label}</span>
    </p>
  );
}

const variants: Record<Surface, { primary: string; secondary: string }> = {
  light: { primary: buttonStyles.primary, secondary: buttonStyles.secondary },
  dark: { primary: buttonStyles.primaryInverse, secondary: buttonStyles.secondaryInverse },
  brand: { primary: buttonStyles.onBrand, secondary: buttonStyles.secondaryOnBrand },
};

/** "Réserver" only when tickets can be bought; otherwise lead to the event page. */
export function EventCta({ event, ctx, surface = "light", className = "" }: EventCtaProps) {
  const state = getSaleState(event, ctx.now);
  const { sale } = ctx.messages;
  const bookable = state.kind === "onSale";
  const style = bookable ? variants[surface].primary : variants[surface].secondary;

  return (
    <Link href={ctx.href(bookable ? event.urls.book : event.urls.details)} className={`${style} ${className}`}>
      {bookable ? sale.book : sale.details}
      <span className="sr-only">, {eventName(event)}</span>
    </Link>
  );
}
