import type { TicketEvent } from "@/lib/api/schema";
import type { PageContext } from "@/lib/page-context";
import { MatchPoster } from "@/components/events/match-poster";
import { EVENTS_ANCHOR } from "@/components/events/events-section";
import { SafeImage } from "@/components/ui/safe-image";
import { buttonStyles } from "@/components/ui/smart-link";

/**
 * With a photo: dark scrim, white type. Without one: the club's colour as the
 * surface. If the photo fails to load, the dark base underneath keeps the
 * white type legible.
 */
export function Hero({ ctx, event }: { ctx: PageContext; event: TicketEvent | null }) {
  const { page, tenant } = ctx;
  const { hero } = page;
  const surface = hero.imageUrl ? "dark" : "brand";
  const title = hero.title ?? tenant.name;
  const subtitle = hero.subtitle ?? (hero.title ? tenant.name : null);

  return (
    <section
      aria-labelledby="hero-title"
      className={`relative isolate overflow-hidden ${
        surface === "dark" ? "on-dark bg-scrim text-on-scrim" : "bg-brand text-on-brand"
      }`}
    >
      {hero.imageUrl && (
        <>
          <SafeImage
            src={hero.imageUrl}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-scrim via-scrim/80 to-scrim/35 md:bg-linear-to-r md:via-scrim/70 md:to-scrim/20"
          />
        </>
      )}

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 md:pt-16 md:pb-20">
        {event ? (
          <>
            <h1 id="hero-title" className="mb-10 md:mb-14">
              <span className="block text-xl font-bold sm:text-2xl">{title}</span>
              {subtitle && <span className="block text-base font-medium opacity-75 sm:text-lg">{subtitle}</span>}
            </h1>
            <MatchPoster event={event} ctx={ctx} surface={surface} />
          </>
        ) : (
          <div className="py-6 md:py-10">
            <h1 id="hero-title" className="display text-[clamp(3.5rem,15vw,10rem)] uppercase">
              {title}
            </h1>
            {subtitle && <p className="mt-4 max-w-2xl text-xl font-semibold sm:text-2xl">{subtitle}</p>}
            <a
              href={`#${EVENTS_ANCHOR}`}
              className={`${surface === "dark" ? buttonStyles.primaryInverse : buttonStyles.onBrand} mt-8 min-h-13 text-base`}
            >
              {ctx.messages.hero.browse}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
