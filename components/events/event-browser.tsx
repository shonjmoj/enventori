"use client";

import { useState } from "react";
import type { EventBrowserProps } from "./types";

/**
 * Rows are rendered on the server and handed over as nodes; this component only
 * owns filtering and "show more".
 */
export function EventBrowser({ groups, categories, initialCount, locale, labels }: EventBrowserProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const matching = groups
    .flatMap((group) => group.items)
    .filter((item) => category === null || item.category === category);
  const total = matching.length;
  const limit = expanded ? total : Math.min(initialCount, total);
  // The first `limit` matches across groups, in order.
  const visible = new Set(matching.slice(0, limit).map((item) => item.id));
  const hidden = total - limit;

  const chip = (selected: boolean) =>
    `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
      selected ? "bg-ink text-white" : "bg-surface text-ink ring-1 ring-line ring-inset hover:ring-ink"
    }`;

  return (
    <div>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label={labels.filter}
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)} className={chip(category === null)}>
            {labels.all}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={chip(category === c.id)}
            >
              {c.label}
              <span className="tabular-nums opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Every row stays mounted and filtering only toggles `hidden`: rows don't
          remount (no image reloads), and React DevTools doesn't trip over
          reordered server-rendered children. Gaps, not space-y, so hidden
          elements leave no stray margin. */}
      <div className="flex flex-col gap-8">
        {groups.map((group) => (
          <section
            key={group.key}
            aria-labelledby={`month-${group.key}`}
            hidden={!group.items.some((item) => visible.has(item.id))}
          >
            <h3 id={`month-${group.key}`} className="mb-3 text-sm font-semibold text-muted">
              {group.label}
            </h3>
            <ol className="flex flex-col gap-3">
              {group.items.map((item) => (
                <li key={item.id} hidden={!visible.has(item.id)}>
                  {item.node}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-surface px-5 font-semibold ring-1 ring-line ring-inset hover:ring-ink sm:w-auto"
        >
          {(labels.showMore[new Intl.PluralRules(locale).select(hidden)] ?? labels.showMore.other).replace(
            "#",
            String(hidden),
          )}
        </button>
      )}
    </div>
  );
}
