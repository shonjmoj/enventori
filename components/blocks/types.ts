import type { ReactNode } from "react";
import type { Block, BlockOfType, KnownBlockType } from "@/lib/api/schema";
import type { PageContext } from "@/lib/page-context";

export type TileProps = {
  /** True when the tile is alone in its row and gets the full width. */
  wide?: boolean;
};

export type KnownBlock = Exclude<Block, { type: "unknown" }>;

export type Layout = "full" | "tile";

export type BlockRun<B> = { layout: "full"; blocks: [B] } | { layout: "tile"; blocks: B[] };

export type BlockDefinition<T extends KnownBlockType> =
  /** Full-width section. */
  | { layout: "full"; Component: (props: { block: BlockOfType<T>; ctx: PageContext }) => ReactNode }
  /** Card; consecutive tiles share a row. */
  | {
      layout: "tile";
      Component: (props: TileProps & { block: BlockOfType<T>; ctx: PageContext }) => ReactNode;
    };

export type FeaturedEventBlockProps = { block: BlockOfType<"featuredEvent">; ctx: PageContext };

export type NewsletterBlockProps = TileProps & { block: BlockOfType<"newsletter">; ctx: PageContext };

export type PromoBlockProps = TileProps & { block: BlockOfType<"promo">; ctx: PageContext };

export type PartnersBlockProps = { block: BlockOfType<"partners">; ctx: PageContext };

export type Partner = { name: string; logoUrl: string | null; href: string | null };

export type PartnersMarqueeProps = { partners: Partner[]; newTabLabel: string };

export type PartnerLogoProps = { partner: Partner; newTabLabel: string; tabbable: boolean };

export type VideoBlockProps = { block: BlockOfType<"video">; ctx: PageContext };

export type VideoPlayerProps = { embedUrl: string; posterUrl: string | null; title: string; playLabel: string };
