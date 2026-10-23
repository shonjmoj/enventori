# Critique: the current page (Angers)

## What's right, and kept

- **The warning banner.** It's the right channel for match-day changes. Kept, with severity colours that don't depend on the club's brand.
- **A clear "Réserver" button.**
- **The upcoming-events list is the core of the page.**
- **The partner strip.**

## What's wrong, and what I changed because of it

| Problem on the current page | What this page does instead |
| --- | --- |
| The hero spends its space on "SAISON 2026/27" artwork. The next match sits in a small box with small crests. | The hero is a matchday poster: both clubs set large with their crests, then date, venue, sale status and one button. Without a featured match, it becomes a typographic banner in the club's colour. |
| "En ce moment" repeats the hero match. On a phone, the list starts several screens down. | The event promoted by the hero is never repeated by a block (`heroEventId`). |
| Sale states aren't explained. "M'alerter" doesn't say when tickets go on sale. | Each row says why it can or can't be bought: "Prévente abonnés jusqu'au 27 oct.", "Ouverture de la vente le 2 nov. à 10h00". "Réserver" appears only when buying is possible. |
| "Date à confirmer" sits next to a precise time (20h45). | Unknown dates show the month and "À confirmer", with no invented time. |
| Light-grey text and grey labels on pink fail contrast, and a "LIGUE 1" watermark sits behind each row. | Brand colours are assigned to roles by measured contrast (WCAG 4.5:1). Lighthouse accessibility is 100 for all three clubs. |
| Each row has two equal-weight buttons, "Réserver" and "Voir les offres", where "offres" is vague. | One button per row, with the starting price next to it. |
| Long seasons have no structure. | Rows are grouped by month, with a competition filter and "show more". |
| The desktop menu hides behind a hamburger even when there's room. | Links show inline when there are 4 or fewer; otherwise they go in a drawer. |
