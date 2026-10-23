# Eventori — white-label club home page

One Next.js front-end that renders the ticketing home page of any club from the home-page API payload (`data/<slug>.json` stands in for the API).

```bash
bun install
bun dev            # http://localhost:3000
bun run test       # domain + parsing unit tests (vitest)
bun run lint && bunx tsc --noEmit
bun run build      # prerenders one static page per club
```

| URL | |
| --- | --- |
| `/` | dev index: pick a club |
| `/rivemont`, `/port-vallon`, `/brehaut` | club home pages |
| `rivemont.localhost:3000` | same page, selected by subdomain (`proxy.ts`) |

## Selecting a club

The route is `/[club]`. In production every club has its own host, so `proxy.ts` rewrites `<club>.<ROOT_DOMAIN>` (and `<club>.localhost` locally) to `/<club>`. Components never know how the club was chosen. **A 4th club is a new JSON file:** `generateStaticParams` reads the data folder, and nothing else changes.

## Architecture

```text
lib/api/        the only code that knows the raw API shape
  schema.ts       zod, lenient: bad items dropped, optional fields → null,
                  unknown block types kept as { type: "unknown" }
  home-page.ts    getHomePage(slug) ('use cache'), listClubSlugs()
lib/domain/     pure functions, "now" always passed in, unit-tested
  events.ts       upcoming filter + sort, featured lookup, home/away
  sale-state.ts   event → soldOut | onSale(+presale) | presaleSoon | opensAt | notAnnounced
  format.ts       Intl dates in the venue's time zone, relative days, home-time hint
  theme.ts        brand colours → legible colour roles (WCAG contrast)
lib/i18n/       UI copy keyed by tenant.locale (fr only today)
lib/page-context.ts   tenant, now, messages, formatter: what every server component needs
components/
  layout/  hero/  events/  ui/
  blocks/registry.tsx   block type → { layout: "tile" | "full", Component }
app/[club]/page.tsx     notice → header → hero → events → blocks (API order) → footer
```

Everything is a server component except the few parts that need the browser: notice dismissal, the menu drawer, the competition filter / "show more", the click-to-load video, the partners marquee and image error fallbacks.

The partners strip is an infinite marquee built with `motion` (framer-motion's current package). It loops seamlessly by wrapping `x` by one copy's width, slows to a third of its speed on hover or keyboard focus (the hovered logo comes back to full colour), pauses off-screen, and becomes a static wrapped row under `prefers-reduced-motion`.

**New block type:** add a schema in `lib/api/schema.ts`, a component, and one line in `components/blocks/registry.tsx`. Until then, the renderer skips the block (with a dev-only warning), so the backend can ship it first. The `video` block in Port-Vallon's payload isn't in the documented list. I implemented it to show that this path takes one component and one registry line.

## How the data notes are handled

| Note | What the page does |
| --- | --- |
| `snapshotAt` is "now" | Parsed once into `PageContext.now`. No `Date.now()` anywhere. |
| Datetimes are UTC, `venue.timeZone` | Shown in the venue's zone. Lisbon away match: `20h00`, plus "21h00 à Paris". The DST change on 25 Oct is covered by a test. |
| `hasUnknownStartDate` | No fake day or time: the tile shows only the month and "À confirmer", and the row says "prévu autour du 12 déc.". The placeholder is used only for sorting, and the event stays listed for 7 days after it. |
| Sale status | Each row says *why* it can or can't be bought: "Prévente abonnés jusqu'au 27 oct. à 23h00", "Prévente abonnés le 26 oct. à 9h00, grand public le 2 nov.", "Ouverture de la vente le 2 nov. à 10h00", "Mise en vente prochainement". "Réserver" appears only when buying is possible; otherwise the button is "Plus d'infos". |
| `isSoldOut` can be stale | "Complet", but the row still links to the event page rather than a dead end. |
| `priceFrom` in minor units, sometimes `0` | Event rows show "À partir de 12 €" next to the button (the currency's own decimals, none when whole). A `0` or invalid currency means not priced yet, so nothing is shown; neither on sold-out rows. Per-seat prices stay on the seat map. |
| Events unsorted, some started | Sorted; started events dropped (Port-Vallon's 901 kicked off an hour before the snapshot). |
| Event kinds | Matches show crests; other kinds show their title. Filter chips group by competition, or by kind for non-matches. |
| Blocks in array order, new types anytime | Rendered in order; consecutive tiles (promo, newsletter) share a grid row; unknown types are skipped. |
| Brand colours not guaranteed | See below. |
| Images can be null or broken | `SafeImage` handles null and `onError` (Port-Vallon's `lorvan-2019.svg` is a real 404). Crests fall back to initials, the club logo to a monogram plus name, partner logos to the partner name, hero and promo photos to a colour surface. |

### Brand colours → roles

Clubs pick their colours; nobody checks them on white. `buildTheme` assigns roles by contrast instead of painting the UI with the raw values:

- **brand**: large surfaces (hero without photo, newsletter, promo without image). Text on it uses the secondary colour if it reads (≥ 4.5:1), else black or white.
- **action**: buttons and links on the light page. A brand colour too light to stand on white becomes a surface colour only; actions fall back to the secondary colour, then to ink.
- **action-inverse**: buttons over the dark hero photo, chosen the same way against the scrim.

Result: Rivemont (#111 / #FFF) gets black actions and white buttons on the photo. Port-Vallon's pale blue becomes the surface colour, with navy actions. Bréhaut's neon lime with no secondary becomes a lime hero with ink text and ink buttons.

### Design

- One family, Archivo. Its width axis gives a condensed display voice (team names, section titles) and a normal text voice.
- The hero is a matchday poster: the two clubs set huge with their crests, then date, venue, competition, sale status and the button. That's everything needed to decide.
- Without a featured event (Bréhaut), the hero becomes a typographic banner in the club's colour, with a link to the dates.
- Everything else stays neutral, so each club's colour and crest carry its identity.

## Critique and decisions

- [CRITIQUE.md](CRITIQUE.md): what's wrong and right with the current Angers page, and what changed because of it.
- [DECISIONS.md](DECISIONS.md): rejected directions, the partner carousel, what's deliberately left out, and next steps.
