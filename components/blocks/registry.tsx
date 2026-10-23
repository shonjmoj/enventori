import type { KnownBlockType } from "@/lib/api/schema";
import { FeaturedEventBlock } from "./featured-event-block";
import { NewsletterBlock } from "./newsletter-block";
import { PartnersBlock } from "./partners-block";
import { PromoBlock } from "./promo-block";
import type { BlockDefinition } from "./types";
import { VideoBlock } from "./video-block";

/**
 * One entry per block type the front-end knows. Adding a type: a schema in
 * lib/api/schema.ts, a component, and a line here. Types missing from this map
 * are skipped by the renderer — the backend can ship them before we do.
 */
export const blockRegistry: { [T in KnownBlockType]: BlockDefinition<T> } = {
  featuredEvent: { layout: "full", Component: FeaturedEventBlock },
  promo: { layout: "tile", Component: PromoBlock },
  newsletter: { layout: "tile", Component: NewsletterBlock },
  partners: { layout: "full", Component: PartnersBlock },
  video: { layout: "full", Component: VideoBlock },
};
