import type { HomePage } from "@/lib/api/schema";
import { createFormatter, type Formatter } from "@/lib/domain/format";
import { getMessages, type Messages } from "@/lib/i18n/messages";

/** Everything a server component needs to render a piece of a club's page. */
export type PageContext = {
  page: HomePage;
  tenant: HomePage["tenant"];
  /** The API snapshot time. The single source of "now" for the whole page. */
  now: Date;
  messages: Messages;
  format: Formatter;
  /** Event already promoted by the hero, so blocks don't repeat it. */
  heroEventId: string | null;
  /** Scopes a site-relative link to this club. */
  href: (path: string) => string;
};

/**
 * API links are relative to the club's own site (`/evenement/185`). Scope them
 * so path mode (`/rivemont/…`) keeps the club; absolute URLs and #anchors pass
 * through. On subdomains, proxy.ts leaves `/<club>/…` paths untouched.
 */
export function clubHref(slug: string, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return path === "/" ? `/${slug}` : `/${slug}${path}`;
}

export function createPageContext(page: HomePage, heroEventId: string | null): PageContext {
  const messages = getMessages(page.tenant.locale);
  return {
    page,
    tenant: page.tenant,
    now: new Date(page.snapshotAt),
    messages,
    format: createFormatter(page.tenant.locale, page.tenant.timeZone, messages),
    heroEventId,
    href: (path) => clubHref(page.tenant.slug, path),
  };
}
