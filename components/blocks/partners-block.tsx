import { PartnersMarquee } from "./partners-marquee";
import type { PartnersBlockProps } from "./types";

/** Full-bleed band: the strip runs edge to edge, the title stays in the column. */
export function PartnersBlock({ block, ctx }: PartnersBlockProps) {
  if (block.partners.length === 0) return null;

  const headingId = `${block.id}-title`;
  const title = block.title ?? ctx.messages.partners.fallbackTitle;

  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-6xl flex flex-col gap-4 py-4 px-4 sm:py-8 sm:px-6">
      <h2 id={headingId} className="display mx-auto mb-8 max-w-6xl px-4 text-3xl sm:px-6 sm:text-4xl">
        {title}
      </h2>
      <PartnersMarquee partners={block.partners} newTabLabel={ctx.messages.header.newTab} />
    </section>
  );
}
