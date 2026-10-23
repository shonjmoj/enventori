import type { TicketEvent } from "@/lib/api/schema";
import type { PageContext } from "@/lib/page-context";

/** The date is what fans scan for first, so it gets its own column. */
export function DateTile({ event, ctx }: { event: TicketEvent; ctx: PageContext }) {
  const timeZone = event.venue?.timeZone;
  const tile = ctx.format.tile(event.startDatetime, timeZone);

  if (event.hasUnknownStartDate) {
    // Only the month is trustworthy: the placeholder day and time may move.
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-md px-1 py-3 text-center ring-1 ring-line ring-inset [background:repeating-linear-gradient(-45deg,transparent_0_6px,var(--paper)_6px_8px)]">
        <span className="display text-2xl">{tile.month}</span>
        <span className="mt-1 text-[0.7rem] font-medium leading-tight text-muted">
          {ctx.messages.events.dateTbcShort}
        </span>
      </div>
    );
  }

  return (
    <time
      dateTime={event.startDatetime}
      className="flex h-full flex-col items-center justify-center rounded-md bg-paper px-1 py-3 text-center"
    >
      <span className="text-xs font-medium text-muted">{tile.weekday}</span>
      <span className="display text-[2.4rem] tabular-nums">{tile.day}</span>
      <span className="text-sm font-semibold">{tile.month}</span>
      <span className="mt-1 text-xs font-medium tabular-nums text-muted">{tile.time}</span>
    </time>
  );
}
