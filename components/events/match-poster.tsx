import { eventName, isAwayGame, isMatch, teamLabel } from "@/lib/domain/events";
import { getSaleState } from "@/lib/domain/sale-state";
import { Crest } from "@/components/ui/crest";
import { EventCta, SaleStatus } from "./sale";
import type { MatchPosterProps } from "./types";

/**
 * The matchday poster: the two clubs set huge in the condensed cut, then
 * everything a fan needs to decide — when, where, can I buy — and the button.
 */
export function MatchPoster({ event, ctx, surface, headingLevel = "h2", size = "hero" }: MatchPosterProps) {
  const { format, messages, tenant, now } = ctx;
  const Heading = headingLevel;
  const venueTimeZone = event.venue?.timeZone ?? null;
  const hero = size === "hero";
  const crest = hero ? 88 : 64;
  const nameSize = hero ? "text-[clamp(3.25rem,12vw,7.5rem)]" : "text-[clamp(2.5rem,8vw,4.5rem)]";

  const relative = event.hasUnknownStartDate ? null : format.relativeDay(event.startDatetime, now, venueTimeZone);
  const when = event.hasUnknownStartDate
    ? `${messages.events.dateTbc}, ${messages.events.around(format.shortDate(event.startDatetime, venueTimeZone))}`
    : `${format.longDate(event.startDatetime, venueTimeZone)}, ${format.time(event.startDatetime, venueTimeZone)}`;
  const homeTime = event.hasUnknownStartDate ? null : format.homeTimeHint(event.startDatetime, venueTimeZone);
  const where =
    isAwayGame(event, tenant) && event.venue?.city
      ? messages.events.away(event.venue.city)
      : [event.venue?.name, event.venue?.city].filter(Boolean).join(", ");
  const competition = [event.competition?.name, event.competition?.round].filter(Boolean).join(", ");

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
      <div className="min-w-0">
        {relative && (
          <p className="mb-4 inline-flex rounded-full bg-current/12 px-3 py-1 text-sm font-semibold">
            {relative}
          </p>
        )}

        <Heading className={`display uppercase ${nameSize}`}>
          {isMatch(event) ? (
            <>
              <span className="flex items-center gap-[0.18em]">
                <Crest name={teamLabel(event.homeTeam)} logoUrl={event.homeTeam.logoUrl} size={crest} className="size-[0.8em]! shrink-0" />
                <span className="min-w-0 wrap-break-word">{teamLabel(event.homeTeam)}</span>
              </span>
              <span className="my-[0.08em] block pl-[3.5em] text-[0.28em] font-semibold normal-case tracking-normal opacity-70 font-stretch-100%">
                {messages.hero.versus}
              </span>
              <span className="flex items-center gap-[0.18em]">
                <Crest name={teamLabel(event.awayTeam)} logoUrl={event.awayTeam.logoUrl} size={crest} className="size-[0.8em]! shrink-0" />
                <span className="min-w-0 wrap-break-word">{teamLabel(event.awayTeam)}</span>
              </span>
            </>
          ) : (
            <span className="block text-[0.55em] normal-case">{eventName(event)}</span>
          )}
        </Heading>

        <div className="mt-6 space-y-1 text-base sm:text-lg">
          <p className="font-semibold">
            {event.hasUnknownStartDate ? when : <time dateTime={event.startDatetime}>{when}</time>}
            {homeTime && <span className="font-normal opacity-75"> ({homeTime})</span>}
          </p>
          {where && <p className="opacity-80">{where}</p>}
          {competition && <p className="opacity-80">{competition}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:min-w-64 md:items-stretch">
        <SaleStatus state={getSaleState(event, now)} ctx={ctx} />
        <EventCta event={event} ctx={ctx} surface={surface} className="min-h-13 w-full text-base" />
      </div>
    </div>
  );
}
