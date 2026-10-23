import { NextResponse, type NextRequest } from "next/server";

/*
 * Production: every club has its own host (rivemont.<domain>). Rewrite it to
 * the /[club] route so pages never need to know how the club was selected.
 * Locally, rivemont.localhost:3000 works the same way; /rivemont works too.
 */
const ROOT_DOMAINS = ["localhost", ...(process.env.ROOT_DOMAIN ? [process.env.ROOT_DOMAIN] : [])];

export function proxy(request: NextRequest) {
  // The Host header, not nextUrl: the latter reflects the server's own host.
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const root = ROOT_DOMAINS.find((domain) => hostname.endsWith(`.${domain}`));
  if (!root) return NextResponse.next();

  const club = hostname.slice(0, -(root.length + 1));
  if (!/^[a-z0-9-]+$/.test(club)) return NextResponse.next();

  const url = request.nextUrl.clone();
  // Links rendered as /<club>/… are already scoped.
  if (url.pathname === `/${club}` || url.pathname.startsWith(`/${club}/`)) return NextResponse.next();
  url.pathname = `/${club}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: skip Next internals and any file (crests, photos, favicon…).
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
