import Link from "next/link";
import { getHomePage, listClubSlugs } from "@/lib/api/home-page";
import { Monogram } from "@/components/ui/crest";
import { SafeImage } from "@/components/ui/safe-image";

/**
 * Development index. In production each club is reached through its own
 * domain (see proxy.ts), never through this page.
 */
export default async function ClubIndex() {
  const slugs = await listClubSlugs();
  const pages = (await Promise.all(slugs.map(getHomePage))).filter((page) => page !== null);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="display text-5xl sm:text-6xl">Billetteries</h1>
      <p className="mt-3 text-lg text-muted">Choisissez un club pour voir sa page d’accueil.</p>

      <ul className="mt-10 space-y-3">
        {pages.map(({ tenant }) => (
          <li key={tenant.slug}>
            <Link
              href={`/${tenant.slug}`}
              className="flex items-center gap-4 rounded-lg bg-surface p-4 ring-1 ring-line hover:ring-ink"
            >
              <span className="grid size-14 shrink-0 place-items-center">
                <SafeImage
                  src={tenant.logoUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 object-contain"
                  fallback={<Monogram name={tenant.shortName ?? tenant.name} className="size-12 text-xl" />}
                />
              </span>
              <span>
                <span className="block text-lg font-bold">{tenant.name}</span>
                <span className="block text-sm text-muted">/{tenant.slug}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
