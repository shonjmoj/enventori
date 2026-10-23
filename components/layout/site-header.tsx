import Link from "next/link";
import type { NavLink } from "@/lib/api/schema";
import type { PageContext } from "@/lib/page-context";
import { Monogram } from "@/components/ui/crest";
import { BagIcon, UserIcon } from "@/components/ui/icons";
import { SafeImage } from "@/components/ui/safe-image";
import { SmartLink } from "@/components/ui/smart-link";
import { NavDrawer } from "./nav-drawer";

/** Up to this many club links fit inline on desktop; beyond, everything goes in the menu. */
const MAX_INLINE_LINKS = 4;

export function SiteHeader({ ctx }: { ctx: PageContext }) {
  const { tenant, messages, page } = ctx;
  const t = messages.header;
  const clubName = tenant.shortName ?? tenant.name;
  const links = page.navigation.map((link) => ({ ...link, href: ctx.href(link.href) }));
  const inline = links.length > 0 && links.length <= MAX_INLINE_LINKS;

  // Platform routes, identical for every club.
  const utilityLinks: NavLink[] = [
    { label: t.account, href: ctx.href("/compte"), external: false },
    { label: t.cart, href: ctx.href("/panier"), external: false },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        {/* Named by its content, not aria-label: the logo's alt, or the visible
            fallback name, so the accessible name always contains what's shown. */}
        <Link href={ctx.href("/")} className="flex min-w-0 items-center gap-3 rounded-md">
          <SafeImage
            src={tenant.logoUrl}
            alt={t.home(tenant.name)}
            width={200}
            height={48}
            preload
            className="h-10 w-auto max-w-[min(52vw,220px)] object-contain object-left sm:h-12"
            fallback={
              <>
                <Monogram name={clubName} tone="brand" className="size-10 text-lg sm:size-11" />
                <span className="truncate text-lg font-bold tracking-tight">
                  {clubName}
                  <span className="sr-only">{t.homeSuffix}</span>
                </span>
              </>
            }
          />
        </Link>

        {inline && (
          <nav aria-label={t.menu} className="ml-6 hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <SmartLink
                    href={link.href}
                    external={link.external}
                    newTabLabel={t.newTab}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 font-medium text-muted hover:text-ink"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1">
          <Link
            href={utilityLinks[0].href}
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-medium hover:bg-paper"
          >
            <UserIcon className="size-5" />
            <span className="sr-only sm:not-sr-only">{t.account}</span>
          </Link>
          <Link
            href={utilityLinks[1].href}
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-medium hover:bg-paper"
          >
            <BagIcon className="size-5" />
            <span className="sr-only sm:not-sr-only">{t.cart}</span>
          </Link>
          {links.length > 0 && (
            <NavDrawer
              links={links}
              utilityLinks={utilityLinks}
              labels={{ menu: t.menu, close: t.closeMenu, newTab: t.newTab }}
              className={inline ? "lg:hidden" : ""}
            />
          )}
        </div>
      </div>
    </header>
  );
}
