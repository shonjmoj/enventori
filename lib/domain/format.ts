import type { Messages } from "@/lib/i18n/messages";

/*
 * Every date is shown in the time zone of the place it happens in, so a match
 * in Lisbon reads in Lisbon time. "Now" is always passed in (the API snapshot),
 * never read from the clock.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export type DateTile = { weekday: string; day: string; month: string; time: string };

export function createFormatter(locale: string, defaultTimeZone: string, messages: Messages) {
  const tz = (timeZone: string | null | undefined) => timeZone ?? defaultTimeZone;
  const fmt = (iso: string, timeZone: string | null | undefined, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { ...options, timeZone: tz(timeZone) }).format(new Date(iso));

  const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase(locale) + value.slice(1);

  function time(iso: string, timeZone?: string | null): string {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: tz(timeZone),
    }).formatToParts(new Date(iso));
    const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${part("hour")}${messages.timeSeparator}${part("minute")}`;
  }

  /** Calendar date (YYYY-MM-DD) of an instant in a given zone. */
  function calendarDay(iso: string, timeZone?: string | null): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: tz(timeZone) }).format(new Date(iso));
  }

  return {
    time,

    tile(iso: string, timeZone?: string | null): DateTile {
      return {
        weekday: fmt(iso, timeZone, { weekday: "short" }),
        day: fmt(iso, timeZone, { day: "numeric" }),
        month: fmt(iso, timeZone, { month: "short" }),
        time: time(iso, timeZone),
      };
    },

    /** "Dimanche 25 octobre" */
    longDate(iso: string, timeZone?: string | null): string {
      return capitalize(fmt(iso, timeZone, { weekday: "long", day: "numeric", month: "long" }));
    },

    /** "12 déc." */
    shortDate(iso: string, timeZone?: string | null): string {
      return fmt(iso, timeZone, { day: "numeric", month: "short" });
    },

    /** "2 nov. à 10h00" — moments like sale openings, in the club's zone. */
    shortDateTime(iso: string): string {
      return messages.dateAtTime(fmt(iso, null, { day: "numeric", month: "short" }), time(iso));
    },

    monthKey(iso: string, timeZone?: string | null): string {
      return calendarDay(iso, timeZone).slice(0, 7);
    },

    /** "Novembre 2026" */
    monthLabel(iso: string, timeZone?: string | null): string {
      return capitalize(fmt(iso, timeZone, { month: "long", year: "numeric" }));
    },

    /** "Demain", "Dans 3 jours"… for the coming week only. */
    relativeDay(iso: string, now: Date, timeZone?: string | null): string | null {
      const days = Math.round(
        (Date.parse(calendarDay(iso, timeZone)) - Date.parse(calendarDay(now.toISOString(), timeZone))) /
          DAY_MS,
      );
      if (days < 0 || days > 6) return null;
      return capitalize(new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(days, "day"));
    },

    /** "12 €", "12,50 €" — from minor units, with the currency's own decimals. */
    price({ amount, currency }: { amount: number; currency: string }): string {
      const number = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        trailingZeroDisplay: "stripIfInteger",
      });
      return number.format(amount / 10 ** (number.resolvedOptions().maximumFractionDigits ?? 2));
    },

    /** Kick-off in the club's own zone, when the venue is in another one. */
    homeTimeHint(iso: string, venueTimeZone: string | null): string | null {
      if (!venueTimeZone || venueTimeZone === defaultTimeZone) return null;
      const home = time(iso);
      if (home === time(iso, venueTimeZone)) return null;
      const city = defaultTimeZone.split("/").pop()?.replaceAll("_", " ") ?? defaultTimeZone;
      return messages.events.localTime(home, city);
    },
  };
}

export type Formatter = ReturnType<typeof createFormatter>;
