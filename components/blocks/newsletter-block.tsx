import { buttonStyles, SmartLink } from "@/components/ui/smart-link";
import type { NewsletterBlockProps } from "./types";

/** Text-only, so it carries the club's colour to hold its own next to photo tiles. */
export function NewsletterBlock({ block, ctx, wide }: NewsletterBlockProps) {
  return (
    <article
      className={`flex h-full gap-5 rounded-lg bg-brand p-6 text-on-brand sm:p-8 ${
        wide ? "flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-8" : "flex-col"
      }`}
    >
      <div>
        {block.title && <h3 className="display text-3xl sm:text-4xl">{block.title}</h3>}
        {block.body && <p className="mt-2 max-w-prose text-lg leading-relaxed opacity-85">{block.body}</p>}
      </div>
      <SmartLink
        href={ctx.href(block.cta.href)}
        external={block.cta.external}
        newTabLabel={ctx.messages.header.newTab}
        className={`${buttonStyles.onBrand} shrink-0 self-start ${wide ? "sm:self-center" : "mt-auto"}`}
      >
        {block.cta.label}
      </SmartLink>
    </article>
  );
}
