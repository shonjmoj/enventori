import type { TicketEvent } from "@/lib/api/schema";
import { isMatch, upcomingEvents } from "@/lib/domain/events";
import type { PageContext } from "@/lib/page-context";
import { EventBrowser } from "./event-browser";
import { EventRow } from "./event-row";
import type { BrowserCategory, BrowserGroup } from "./types";

const INITIAL_COUNT = 6;
export const EVENTS_ANCHOR = "dates";

/** Competition for matches, kind for everything else ("Expériences"…). */
function categoryOf(event: TicketEvent, ctx: PageContext): string {
  if (isMatch(event) && event.competition) return event.competition.name;
  return ctx.messages.kinds[event.kind] ?? ctx.messages.otherKind;
}

export function EventsSection({ ctx }: { ctx: PageContext }) {
  const { page, now, format, messages } = ctx;
  const t = messages.events;
  const events = upcomingEvents(page.events, now);
  const onlyMatches = events.every(isMatch);

  const groups: BrowserGroup[] = [];
  const counts = new Map<string, number>();
  for (const event of events) {
    const category = categoryOf(event, ctx);
    counts.set(category, (counts.get(category) ?? 0) + 1);

    // Grouped by month in the club's zone, so a group never splits a matchday.
    const key = format.monthKey(event.startDatetime);
    let group = groups.at(-1);
    if (group?.key !== key) {
      group = { key, label: format.monthLabel(event.startDatetime), items: [] };
      groups.push(group);
    }
    group.items.push({ id: event.id, category, node: <EventRow event={event} ctx={ctx} /> });
  }
  const categories: BrowserCategory[] = [...counts].map(([id, count]) => ({ id, label: id, count }));

  return (
    <section
      id={EVENTS_ANCHOR}
      aria-labelledby="events-heading"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6"
    >
      <h2 id="events-heading" className="display mb-6 text-4xl sm:text-5xl">
        {onlyMatches ? t.headingMatches : t.headingEvents}
      </h2>

      {events.length === 0 ? (
        <div className="rounded-lg bg-surface px-6 py-10 ring-1 ring-line">
          <p className="text-lg font-semibold">{t.emptyTitle}</p>
          <p className="mt-1 text-muted">{t.emptyBody}</p>
        </div>
      ) : (
        <EventBrowser
          groups={groups}
          categories={categories}
          initialCount={INITIAL_COUNT}
          locale={ctx.tenant.locale}
          labels={{ filter: t.filterLabel, all: t.all, showMore: t.showMore }}
        />
      )}
    </section>
  );
}
