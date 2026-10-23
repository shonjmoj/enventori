import type { Team, Tenant, TicketEvent } from "@/lib/api/schema";

/**
 * When a match date is unknown, `startDatetime` is a placeholder that can move
 * by several days, so a placeholder slightly in the past doesn't mean the match
 * has been played.
 */
const UNKNOWN_DATE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;

export function hasStarted(event: TicketEvent, now: Date): boolean {
  const start = Date.parse(event.startDatetime);
  const grace = event.hasUnknownStartDate ? UNKNOWN_DATE_GRACE_MS : 0;
  return start + grace <= now.getTime();
}

/** Events still to come, soonest first. The API sends them unsorted. */
export function upcomingEvents(events: TicketEvent[], now: Date): TicketEvent[] {
  return events
    .filter((event) => !hasStarted(event, now))
    .sort(
      (a, b) =>
        Date.parse(a.startDatetime) - Date.parse(b.startDatetime) || a.id.localeCompare(b.id),
    );
}

export function findUpcomingEvent(
  events: TicketEvent[],
  id: string | null,
  now: Date,
): TicketEvent | null {
  if (!id) return null;
  const event = events.find((candidate) => candidate.id === id);
  return event && !hasStarted(event, now) ? event : null;
}

export function isMatch(
  event: TicketEvent,
): event is TicketEvent & { homeTeam: Team; awayTeam: Team } {
  return event.homeTeam !== null && event.awayTeam !== null;
}

export function isAwayGame(event: TicketEvent, tenant: Tenant): boolean {
  return isMatch(event) && event.homeTeam.name !== tenant.name;
}

export function teamLabel(team: Team): string {
  return team.shortName ?? team.name;
}

/** Human name of an event, whatever its kind. */
export function eventName(event: TicketEvent): string {
  if (event.title) return event.title;
  if (isMatch(event)) return `${teamLabel(event.homeTeam)} – ${teamLabel(event.awayTeam)}`;
  return event.competition?.name ?? event.venue?.name ?? "";
}
