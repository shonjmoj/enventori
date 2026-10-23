import Link from "next/link";
import { ExternalIcon } from "./icons";
import type { SmartLinkProps } from "./types";

/** Internal links go through the router; external ones open a new tab and say so. */
export function SmartLink({
  href,
  external = false,
  newTabLabel,
  className,
  children,
  showExternalIcon = true,
}: SmartLinkProps) {
  if (!external) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {showExternalIcon && <ExternalIcon className="size-[0.9em] shrink-0 opacity-70" />}
      {newTabLabel && <span className="sr-only"> {newTabLabel}</span>}
    </a>
  );
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-[0.95rem] font-semibold transition-colors";

export const buttonStyles = {
  primary: `${buttonBase} bg-action text-on-action hover:opacity-90`,
  secondary: `${buttonBase} bg-surface text-ink ring-1 ring-line ring-inset hover:ring-ink`,
  primaryInverse: `${buttonBase} bg-action-inverse text-on-action-inverse hover:opacity-90`,
  secondaryInverse: `${buttonBase} text-on-scrim ring-1 ring-on-scrim/50 ring-inset hover:ring-on-scrim`,
  onBrand: `${buttonBase} bg-on-brand text-brand hover:opacity-90`,
  secondaryOnBrand: `${buttonBase} text-on-brand ring-1 ring-current/40 ring-inset hover:ring-current`,
} as const;
