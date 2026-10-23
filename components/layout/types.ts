import type { NavLink, Notice } from "@/lib/api/schema";

export type NavDrawerProps = {
  links: NavLink[];
  /** Account / cart, shown under the club's links. */
  utilityLinks: NavLink[];
  labels: { menu: string; close: string; newTab: string };
  className?: string;
};

export type NoticeBarProps = Notice & { dismissLabel: string };
