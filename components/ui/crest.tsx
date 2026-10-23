import { SafeImage } from "./safe-image";
import type { CrestProps, MonogramProps } from "./types";

export function initials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .split(/[\s-]+/)
    .filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Stand-in when a club has no crest: its initials, never an empty box. */
export function Monogram({ name, className = "", style, tone = "neutral" }: MonogramProps) {
  const colours =
    tone === "brand" ? "bg-brand text-on-brand" : "bg-surface text-ink ring-1 ring-line ring-inset";
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`display grid shrink-0 place-items-center rounded-full ${colours} ${className}`}
    >
      {initials(name)}
    </span>
  );
}

/** Crests are decorative: the team name is always printed next to them. */
export function Crest({ name, logoUrl, size, className = "" }: CrestProps) {
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <SafeImage
        src={logoUrl}
        alt=""
        width={size}
        height={size}
        className="absolute inset-0 size-full object-contain"
        fallback={
          <Monogram
            name={name}
            className="h-[88%] w-[88%]"
            style={{ fontSize: Math.round(size * 0.34) }}
          />
        }
      />
    </span>
  );
}
