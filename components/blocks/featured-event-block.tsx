import { findUpcomingEvent } from "@/lib/domain/events";
import { MatchPoster } from "@/components/events/match-poster";
import { Section } from "./section";
import type { FeaturedEventBlockProps } from "./types";

export function FeaturedEventBlock({ block, ctx }: FeaturedEventBlockProps) {
  // Already the hero's headline: showing it twice just pushes the list down.
  if (block.eventId === ctx.heroEventId) return null;

  const event = findUpcomingEvent(ctx.page.events, block.eventId, ctx.now);
  if (!event) return null;

  return (
    <Section id={block.id} title={block.title}>
      <div className="rounded-lg bg-surface p-6 ring-1 ring-line sm:p-10">
        <MatchPoster event={event} ctx={ctx} surface="light" headingLevel="h3" size="block" />
      </div>
    </Section>
  );
}
