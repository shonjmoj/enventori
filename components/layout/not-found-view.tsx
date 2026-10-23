"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

/**
 * not-found files don't receive params; read the club from the URL so the way
 * back leads to the club's home, or to the club picker outside any club.
 */
export function NotFoundView({ clubs = [] }: { clubs?: string[] }) {
  const params = useParams<{ club?: string }>();
  const home = params.club && clubs.includes(params.club) ? `/${params.club}` : "/";

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <h1 className="display text-5xl sm:text-6xl">Page introuvable</h1>
      <p className="mt-4 text-lg text-muted">
        Cette page n’existe pas ou n’est pas encore disponible.
      </p>
      <Link
        href={home}
        className="mt-8 inline-flex min-h-11 items-center self-start rounded-md bg-ink px-5 font-semibold text-white"
      >
        Retour à l’accueil
      </Link>
    </main>
  );
}
