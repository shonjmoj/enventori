import { SafeImage } from "@/components/ui/safe-image";
import { buttonStyles, SmartLink } from "@/components/ui/smart-link";
import type { PromoBlockProps } from "./types";

/** With an image: picture card. Without one (or if it breaks): a band in the club's colour. */
export function PromoBlock({ block, ctx, wide }: PromoBlockProps) {
  const cta = block.cta && (
    <SmartLink
      href={ctx.href(block.cta.href)}
      external={block.cta.external}
      newTabLabel={ctx.messages.header.newTab}
      className={`${block.imageUrl ? buttonStyles.primary : buttonStyles.onBrand} mt-5 self-start`}
    >
      {block.cta.label}
    </SmartLink>
  );

  const text = (
    <>
      {block.title && <h3 className="text-xl font-bold leading-tight text-balance sm:text-2xl">{block.title}</h3>}
      {block.body && <p className="mt-2 max-w-prose leading-relaxed opacity-80">{block.body}</p>}
      {cta}
    </>
  );

  if (!block.imageUrl) {
    return (
      <article className={`flex h-full rounded-lg bg-brand p-6 text-on-brand sm:p-8 flex-col ${wide ? "sm:flex-row sm:items-center sm:justify-between sm:gap-8" : ""}`}>
        {wide ? (
          <>
            <div>
              {block.title && <h3 className="display text-3xl sm:text-4xl">{block.title}</h3>}
              {block.body && <p className="mt-2 max-w-prose text-lg opacity-85">{block.body}</p>}
            </div>
            {block.cta && (
              <SmartLink
                href={ctx.href(block.cta.href)}
                external={block.cta.external}
                newTabLabel={ctx.messages.header.newTab}
                className={`${buttonStyles.onBrand} mt-5 shrink-0 self-start sm:mt-0 sm:self-center`}
              >
                {block.cta.label}
              </SmartLink>
            )}
          </>
        ) : (
          <div className="flex flex-col">{text}</div>
        )}
      </article>
    );
  }

  return (
    <article
      className={`flex h-full overflow-hidden rounded-lg bg-surface ring-1 ring-line ${
        wide ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative aspect-[16/10] bg-brand ${wide ? "sm:aspect-auto sm:w-1/2" : ""}`}>
        <SafeImage
          src={block.imageUrl}
          alt=""
          fill
          // Matches the block grid: 1104px column, 16/24px gutters, 20px gaps.
          sizes={
            wide
              ? "(min-width: 1152px) 552px, (min-width: 640px) calc(50vw - 24px), calc(100vw - 32px)"
              : "(min-width: 1152px) 355px, (min-width: 1024px) calc((100vw - 88px) / 3), (min-width: 768px) calc((100vw - 68px) / 2), calc(100vw - 32px)"
          }
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">{text}</div>
    </article>
  );
}
