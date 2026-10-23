import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getHomePage, listClubSlugs } from "@/lib/api/home-page";
import { findUpcomingEvent } from "@/lib/domain/events";
import { buildTheme, themeToCssVariables } from "@/lib/domain/theme";
import { getMessages } from "@/lib/i18n/messages";
import { createPageContext } from "@/lib/page-context";
import { BlockList } from "@/components/blocks/block-list";
import { EventsSection } from "@/components/events/events-section";
import { Hero } from "@/components/hero/hero";
import { NoticeBar } from "@/components/layout/notice-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

// The whole page is the club: nothing to show before `params` resolves. In
// production each club has its own host, so there's no in-app navigation
// between clubs to keep instant. Known clubs are prerendered anyway.
export const instant = false;

export async function generateStaticParams() {
  return (await listClubSlugs()).map((club) => ({ club }));
}

export async function generateMetadata({ params }: PageProps<"/[club]">): Promise<Metadata> {
  const page = await getHomePage((await params).club);
  if (!page) return {};
  return {
    title: `${page.hero.title ?? "Billetterie"} – ${page.tenant.name}`,
    description: getMessages(page.tenant.locale).meta.description(page.tenant.name),
    icons: page.tenant.logoUrl ? [{ url: page.tenant.logoUrl }] : undefined,
  };
}

export default async function ClubHomePage({ params }: PageProps<"/[club]">) {
  const page = await getHomePage((await params).club);
  if (!page) notFound();

  const heroEvent = findUpcomingEvent(page.events, page.hero.featuredEventId, new Date(page.snapshotAt));
  const ctx = createPageContext(page, heroEvent?.id ?? null);
  const theme = themeToCssVariables(buildTheme(page.tenant.brand));

  return (
    <div lang={page.tenant.locale} style={theme as CSSProperties} className="flex min-h-dvh flex-col">
      <a
        href="#contenu"
        className="sr-only z-50 rounded-md bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {ctx.messages.skipToContent}
      </a>
      {page.notice && (
        <NoticeBar {...page.notice} dismissLabel={ctx.messages.notice.dismiss} />
      )}
      <SiteHeader ctx={ctx} />
      <main id="contenu" className="flex-1 pb-12">
        <Hero ctx={ctx} event={heroEvent} />
        <EventsSection ctx={ctx} />
        <BlockList blocks={page.blocks} ctx={ctx} />
      </main>
      <SiteFooter ctx={ctx} />
    </div>
  );
}
