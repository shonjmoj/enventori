import type { ImageProps } from "next/image";
import type { CSSProperties, ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

export type MonogramProps = {
  name: string;
  className?: string;
  style?: CSSProperties;
  tone?: "neutral" | "brand";
};

export type CrestProps = {
  name: string;
  logoUrl: string | null;
  /** Rendered size in px (square box). */
  size: number;
  className?: string;
};

export type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null;
  /** Rendered when there is no URL or the image fails to load. */
  fallback?: ReactNode;
};

export type SmartLinkProps = {
  href: string;
  external?: boolean;
  /** Screen-reader hint for links opening a new tab. */
  newTabLabel?: string;
  className?: string;
  children: ReactNode;
  showExternalIcon?: boolean;
};
