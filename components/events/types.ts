import type { ReactNode } from "react";
import type { TicketEvent } from "@/lib/api/schema";
import type { PageContext } from "@/lib/page-context";

export type Tone = "positive" | "negative" | "pending";

export type Surface = "light" | "dark" | "brand";

export type EventCtaProps = {
  event: TicketEvent;
  ctx: PageContext;
  surface?: Surface;
  className?: string;
};

export type MatchPosterProps = {
  event: TicketEvent;
  ctx: PageContext;
  surface: Surface;
  headingLevel?: "h2" | "h3";
  size?: "hero" | "block";
};

export type BrowserItem = { id: string; category: string; node: ReactNode };
export type BrowserGroup = { key: string; label: string; items: BrowserItem[] };
export type BrowserCategory = { id: string; label: string; count: number };

export type EventBrowserProps = {
  groups: BrowserGroup[];
  categories: BrowserCategory[];
  initialCount: number;
  locale: string;
  labels: {
    filter: string;
    all: string;
    showMore: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
  };
};
