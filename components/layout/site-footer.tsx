import type { PageContext } from "@/lib/page-context";
import { SmartLink } from "@/components/ui/smart-link";

export function SiteFooter({ ctx }: { ctx: PageContext }) {
  const { tenant, messages, page, now } = ctx;
  const t = messages.footer;
  const linkClass = "inline-flex min-h-10 items-center gap-1.5 text-white/75 hover:text-white";

  return (
    <footer className="on-dark mt-auto bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="display text-3xl sm:text-4xl">{tenant.name}</p>
        </div>

        {page.navigation.length > 0 && (
          <nav aria-label={t.navigation}>
            <h2 className="text-sm font-semibold text-white/60">{t.navigation}</h2>
            <ul>
              {page.navigation.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <SmartLink
                    href={ctx.href(link.href)}
                    external={link.external}
                    newTabLabel={messages.header.newTab}
                    className={linkClass}
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <nav aria-label={t.help}>
          <h2 className="text-sm font-semibold text-white/60">{t.help}</h2>
          <ul>
            {t.legal.map((link) => (
              <li key={link.href}>
                <SmartLink href={ctx.href(link.href)} className={linkClass}>
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-sm text-white/55 sm:px-6">
          <p>
            © {now.getUTCFullYear()} {tenant.name}
          </p>
          <p>{t.poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}
