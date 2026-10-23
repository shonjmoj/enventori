/*
 * Brand colours are picked by each club's marketing team, with no guarantee of
 * legibility. Rather than painting the UI with them blindly, derive roles from
 * WCAG contrast:
 *
 * - `brand`: large surfaces (hero without photo, promo banners), with the most
 *   legible `on-brand` text colour — secondary if it reads, else black/white.
 * - `action`: buttons and links on the light page. A brand colour too light to
 *   stand on white becomes surface-only; actions fall back to the secondary
 *   colour, then to ink.
 * - `action-inverse`: buttons on dark imagery, same idea against the scrim.
 */

// Mirrors of the --ink and --scrim tokens in app/globals.css: the contrast
// maths runs on the server, where CSS variables can't be read.
export const INK = "#14161a";
export const WHITE = "#ffffff";
const PAGE = WHITE; // rows and cards sit on white
const SCRIM = "#0d0f12";
const FALLBACK_BRAND = "#1d2330";

const MIN_UI_CONTRAST = 3; // WCAG 1.4.11, large text
const MIN_TEXT_CONTRAST = 4.5; // WCAG 1.4.3

type Rgb = [number, number, number];

export function parseHex(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const hex = match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  return `#${hex.toLowerCase()}`;
}

function toRgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Black or white, whichever reads best on `background`. */
export function readableOn(background: string): string {
  return contrast(background, INK) >= contrast(background, WHITE) ? INK : WHITE;
}

function firstLegible(candidates: (string | null)[], background: string, min: number) {
  return candidates.find((c): c is string => c !== null && contrast(c, background) >= min) ?? null;
}

export type Theme = {
  brand: string;
  onBrand: string;
  action: string;
  onAction: string;
  actionInverse: string;
  onActionInverse: string;
};

export function buildTheme(brand: { primary: string | null; secondary: string | null }): Theme {
  const primary = parseHex(brand.primary) ?? FALLBACK_BRAND;
  const secondary = parseHex(brand.secondary);

  const onBrand = firstLegible([secondary], primary, MIN_TEXT_CONTRAST) ?? readableOn(primary);
  const action = firstLegible([primary, secondary], PAGE, MIN_UI_CONTRAST) ?? INK;
  const actionInverse = firstLegible([primary, secondary], SCRIM, MIN_UI_CONTRAST) ?? WHITE;

  return {
    brand: primary,
    onBrand,
    action,
    onAction: readableOn(action),
    actionInverse,
    onActionInverse: readableOn(actionInverse),
  };
}

export function themeToCssVariables(theme: Theme): Record<string, string> {
  return {
    "--brand": theme.brand,
    "--on-brand": theme.onBrand,
    "--action": theme.action,
    "--on-action": theme.onAction,
    "--action-inverse": theme.actionInverse,
    "--on-action-inverse": theme.onActionInverse,
  };
}
