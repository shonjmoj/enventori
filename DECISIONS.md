# Decisions

## Directions considered and rejected

**1. Using the club's raw brand colours across the UI.** This is the obvious white-label approach: the primary colour on buttons and links, the secondary for text. I rejected it because the data breaks it:

- Port-Vallon's pale blue (`#A7D8F0`) is unreadable on white.
- Bréhaut's neon lime has no secondary colour.
- Rivemont's white secondary disappears on a white page.

Instead, `buildTheme` gives each colour a role by measured contrast: brand surface, action, or inverse action. A colour that can't carry text becomes a surface only.

**2. Strict, fail-fast parsing of the API.** A strict schema is simpler, and it catches backend bugs early. But the API isn't ours, and one malformed event would take the whole club's page down on match day. The parser in `lib/api/schema.ts` is lenient instead:

- A broken event, partner or block is dropped.
- Optional fields fall back to `null`.
- Unknown block types are kept as `{ type: "unknown" }` and skipped, so the backend can ship a new block before the front-end supports it.

**3. Repeating the featured match in a block below the hero.** This is what the current page does with "En ce moment", and Rivemont's payload asks for it again: its `featuredEvent` block names the hero's match. I rejected the repetition because the hero already sells that match, and on a phone the repeat pushes the list down by a screen. Blocks skip the event the hero already promotes.

## The partner carousel: modernising the strip

The static block of partner logos looked dated next to the rest of the page. It's now an infinite horizontal marquee built with `motion` (framer-motion's current package). It's the one piece of motion on the page that runs without the user doing anything, so it had to behave well:

- **Seamless loop.** The list repeats enough times to cover the screen, so 6 partners loop as cleanly as 15.
- **Hover or focus.** The strip eases down to a third of its speed, so a logo is easy to follow and click, and the hovered one comes back to full colour.
- **Off-screen.** It pauses.
- **Reduced motion.** It becomes a static, wrapped row.
- **Screen readers and keyboards.** They meet each partner once; the repeated copies are hidden from them.

One trade-off: `<motion.div>` brings in about 35 KB of animation, gesture and layout code just to move one strip. The animation loop writes the `transform` itself instead, which cut the page's JavaScript from 48 KB to about 11 KB gzipped.

## Deliberately left out

- **Pages behind the links.** Booking, seat map, account and cart are out of scope. Links are scoped to the club and land on a styled 404.
- **"M'alerter".** The API gives no alert or waitlist URL. Events that can't be booked link to their details page rather than to a button that does nothing.
- **Live updates.** Nothing refreshes `isSoldOut`; pages are prerendered from the snapshot.
- **Other locales.** The copy is French only, but `lib/i18n/messages.ts` is ready for more.
- **Other video providers.** Only YouTube is supported; other providers are skipped.

## With two more days

1. **Freshness.** Swap the JSON reader for `fetch` with a cache tag per club, and invalidate it from a backend webhook, so "Complet" and sale openings appear without a rebuild.
2. **A hostile fourth club.** Add a fixture with every edge case at once: no logo, unreadable colours, an empty event list, a long club name, unknown blocks. Run Playwright screenshot tests on it and on the three real clubs, at phone and desktop widths.
3. **Lighthouse in CI.** Add a performance budget so regressions such as the 35 KB motion import are caught automatically.
4. **"M'alerter" end to end,** once the API exposes an alert or waitlist URL.
5. **English copy,** with the locale taken from `tenant.locale`.
