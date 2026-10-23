import Link from "next/link";
import type { TicketEvent } from "@/lib/api/schema";
import { eventName, isAwayGame, isMatch, teamLabel } from "@/lib/domain/events";
import { getSaleState } from "@/lib/domain/sale-state";
import type { PageContext } from "@/lib/page-context";
import { Crest } from "@/components/ui/crest";
import { DateTile } from "./date-tile";
import { EventCta, SaleStatus } from "./sale";

export function EventRow({ event, ctx }: { event: TicketEvent; ctx: PageContext }) {
  const { format, messages, tenant } = ctx;
  const t = messages.events;
  const venueTimeZone = event.venue?.timeZone ?? null;
  const titleId = `event-${event.id}-title`;

  const competition = [event.competition?.name, event.competition?.round].filter(Boolean).join(", ");
  const away = isAwayGame(event, tenant) && event.venue?.city ? t.away(event.venue.city) : null;
  const where = away ?? event.venue?.name;
  const homeTime = event.hasUnknownStartDate
    ? null
    : format.homeTimeHint(event.startDatetime, venueTimeZone);
  const sale = getSaleState(event, ctx.now);
  const price = event.priceFrom && sale.kind !== "soldOut" ? format.price(event.priceFrom) : null;

  return (
    <article
      aria-labelledby={titleId}
      className="grid grid-cols-[4.75rem_1fr] gap-x-4 gap-y-4 rounded-lg bg-surface p-3 ring-1 ring-line sm:grid-cols-[5.5rem_1fr_auto] sm:items-center sm:p-4"
    >
      <DateTile event={event} ctx={ctx} />

      <div className="min-w-0 self-center">
        <h4 id={titleId} className="text-[1.05rem] font-bold leading-tight sm:text-lg">
          <Link href={ctx.href(event.urls.details)} className="hover:underline">
            {isMatch(event) ? (
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-2">
                  <Crest name={teamLabel(event.homeTeam)} logoUrl={event.homeTeam.logoUrl} size={28} />
                  {teamLabel(event.homeTeam)}
                </span>
                <span className="sr-only">{messages.hero.versus}</span>
                <span className="inline-flex items-center gap-2">
                  {/* Dash travels with the away team when the line wraps. */}
                  <span aria-hidden="true" className="font-normal text-muted">
                    –
                  </span>
                  <Crest name={teamLabel(event.awayTeam)} logoUrl={event.awayTeam.logoUrl} size={28} />
                  {teamLabel(event.awayTeam)}
                </span>
              </span>
            ) : (
              eventName(event)
            )}
          </Link>
        </h4>

        <div className="mt-1.5 space-y-0.5 text-sm text-muted">
          {competition && <p>{competition}</p>}
          {(where || homeTime) && (
            <p>
              <span className={away ? "font-semibold text-ink" : undefined}>{where}</span>
              {homeTime && <span>{where ? ", " : ""}{homeTime}</span>}
            </p>
          )}
          {event.hasUnknownStartDate && (
            <p>
              {t.dateTbc}, {t.around(format.shortDate(event.startDatetime, venueTimeZone))}
            </p>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <SaleStatus state={sale} ctx={ctx} />
          {price && <p className="text-base font-extrabold text-positive">{t.priceFrom(price)}</p>}
        </div>
      </div>
      
      <EventCta event={event} ctx={ctx} className="col-span-2 sm:col-span-1 sm:min-w-36" />
    </article>
  );
}
