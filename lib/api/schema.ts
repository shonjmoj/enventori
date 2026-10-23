import { z } from "zod";

/*
 * Anti-corruption layer for the home page API.
 *
 * The API is not ours, so parsing is deliberately lenient: one broken event,
 * partner or block is dropped instead of taking the whole page down, optional
 * fields degrade to `null`, and block types we don't know yet are kept as
 * `{ type: "unknown" }` so the renderer can skip them explicitly.
 */

const isoDate = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");
const optionalIsoDate = isoDate.nullable().catch(null);
const optionalString = z.string().trim().min(1).nullable().catch(null);
const assetUrl = optionalString;

const hexColor = z
  .string()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  .nullable()
  .catch(null);

const timeZone = z
  .string()
  .refine(isValidTimeZone)
  .nullable()
  .catch(null);

/**
 * Lowest ticket price, in minor units (1200 = 12 €). A zero shows up on events
 * not yet priced, so only a positive amount counts as a price.
 */
const price = z
  .object({ amount: z.number().int().positive(), currency: z.string().refine(isValidCurrency) })
  .nullable()
  .catch(null);

function isValidCurrency(value: string) {
  try {
    new Intl.NumberFormat("en", { style: "currency", currency: value });
    return true;
  } catch {
    return false;
  }
}

function isValidTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** Parses each item on its own and drops the ones that don't match. */
function lenientArray<T extends z.ZodType>(item: T) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.flatMap((raw) => {
        const parsed = item.safeParse(raw);
        return parsed.success ? [parsed.data as z.output<T>] : [];
      }),
    );
}

const link = z.object({
  label: z.string().trim().min(1),
  href: z.string().min(1),
  external: z.boolean().catch(false),
});

const team = z.object({
  name: z.string().min(1),
  shortName: optionalString,
  logoUrl: assetUrl,
});

const eventSchema = z.object({
  id: z.coerce.string(),
  kind: z.string().catch("MATCH"),
  title: optionalString,
  competition: z
    .object({ name: z.string().min(1), round: optionalString })
    .nullable()
    .catch(null),
  homeTeam: team.nullable().catch(null),
  awayTeam: team.nullable().catch(null),
  venue: z
    .object({ name: optionalString, city: optionalString, timeZone })
    .nullable()
    .catch(null),
  startDatetime: isoDate,
  hasUnknownStartDate: z.boolean().catch(false),
  isOnSale: z.boolean().catch(false),
  isSoldOut: z.boolean().catch(false),
  onSaleAt: optionalIsoDate,
  presale: z
    .object({ audience: z.string().catch(""), startsAt: isoDate, endsAt: isoDate })
    .nullable()
    .catch(null),
  priceFrom: price,
  urls: z.object({ book: z.string().min(1), details: z.string().min(1) }),
});

const blockBase = { id: z.coerce.string(), title: optionalString };

const knownBlockSchemas = {
  featuredEvent: z.object({
    ...blockBase,
    type: z.literal("featuredEvent"),
    eventId: z.coerce.string(),
  }),
  promo: z.object({
    ...blockBase,
    type: z.literal("promo"),
    body: optionalString,
    imageUrl: assetUrl,
    cta: link.nullable().catch(null),
  }),
  newsletter: z.object({
    ...blockBase,
    type: z.literal("newsletter"),
    body: optionalString,
    cta: link,
  }),
  partners: z.object({
    ...blockBase,
    type: z.literal("partners"),
    partners: lenientArray(
      z.object({ name: z.string().min(1), logoUrl: assetUrl, href: optionalString }),
    ),
  }),
  video: z.object({
    ...blockBase,
    type: z.literal("video"),
    provider: z.string(),
    videoId: z.string().min(1),
    posterUrl: assetUrl,
  }),
};

export type KnownBlockType = keyof typeof knownBlockSchemas;
type KnownBlock = { [K in KnownBlockType]: z.output<(typeof knownBlockSchemas)[K]> }[KnownBlockType];
export type UnknownBlock = { type: "unknown"; id: string; rawType: string };
export type Block = KnownBlock | UnknownBlock;
export type BlockOfType<T extends Block["type"]> = Extract<Block, { type: T }>;

function isKnownBlockType(type: string): type is KnownBlockType {
  return Object.hasOwn(knownBlockSchemas, type);
}

const blockSchema = z
  .object({ type: z.string(), id: z.coerce.string() })
  .loose()
  .transform((raw, ctx): Block => {
    if (!isKnownBlockType(raw.type)) {
      return { type: "unknown", id: raw.id, rawType: raw.type };
    }
    const parsed = knownBlockSchemas[raw.type].safeParse(raw);
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", message: `Malformed "${raw.type}" block` });
      return z.NEVER;
    }
    return parsed.data;
  });

export const homePageSchema = z.object({
  snapshotAt: isoDate,
  tenant: z.object({
    slug: z.string().min(1),
    name: z.string().min(1),
    shortName: optionalString,
    logoUrl: assetUrl,
    brand: z
      .object({ primary: hexColor, secondary: hexColor })
      .catch({ primary: null, secondary: null }),
    locale: z.string().catch("fr-FR"),
    timeZone: timeZone.transform((value) => value ?? "Europe/Paris"),
  }),
  notice: z
    .object({
      message: z.string().trim().min(1),
      severity: z.enum(["info", "warning", "critical"]).catch("info"),
    })
    .nullable()
    .catch(null),
  navigation: lenientArray(link),
  hero: z
    .object({
      title: optionalString,
      subtitle: optionalString,
      imageUrl: assetUrl,
      featuredEventId: z.coerce.string().nullable().catch(null),
    })
    .catch({ title: null, subtitle: null, imageUrl: null, featuredEventId: null }),
  events: lenientArray(eventSchema),
  blocks: lenientArray(blockSchema),
});

export type HomePage = z.output<typeof homePageSchema>;
export type Tenant = HomePage["tenant"];
export type TicketEvent = z.output<typeof eventSchema>;
export type Team = z.output<typeof team>;
export type NavLink = z.output<typeof link>;
export type Notice = NonNullable<HomePage["notice"]>;
