import type { ReactNode } from "react";

/** Full-width block wrapper: one container width and rhythm for every block. */
export function Section({ id, title, children }: { id: string; title: string | null; children: ReactNode }) {
  const headingId = `${id}-title`;
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className="mx-auto max-w-6xl px-4 py-8"
    >
      {title && (
        <h2 id={headingId} className="display mb-6 text-3xl sm:text-4xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
