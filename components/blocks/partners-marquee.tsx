"use client";

import {
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import type { PartnerLogoProps, PartnersMarqueeProps } from "./types";

/** px per second. */
const SPEED = 50;

export function PartnersMarquee({
  partners,
  newTabLabel,
}: PartnersMarqueeProps) {
  const reduceMotion = useReducedMotion();
  const viewport = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const firstCopy = useRef<HTMLUListElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  const [copies, setCopies] = useState(2);

  const x = useMotionValue(0);
  const targetSpeed = useMotionValue(SPEED);
  const speed = useSpring(targetSpeed, { stiffness: 80, damping: 20 });
  const inView = useInView(viewport);

  useEffect(() => {
    const view = viewport.current;
    const copy = firstCopy.current;
    if (!view || !copy) return;
    const observer = new ResizeObserver(() => {
      const width = copy.offsetWidth;
      setCopyWidth(width);
      if (width > 0)
        setCopies(Math.max(2, Math.ceil(view.offsetWidth / width) + 1));
    });
    observer.observe(view);
    observer.observe(copy);
    return () => observer.disconnect();
  }, [partners]);

  useAnimationFrame((_, delta) => {
    if (!copyWidth || !inView || reduceMotion) return;
    let next = x.get() - (speed.get() * delta) / 1000;
    if (next <= -copyWidth) next += copyWidth;
    x.set(next);

    if (strip.current) strip.current.style.transform = `translateX(${next}px)`;
  });

  return (
    <div
      ref={viewport}
      onPointerEnter={() => targetSpeed.set(SPEED / 3)}
      onPointerLeave={() => targetSpeed.set(SPEED)}
      onFocus={() => targetSpeed.set(SPEED / 3)}
      onBlur={() => targetSpeed.set(SPEED)}
      className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:mask:none"
    >
      <div
        ref={strip}
        className="flex w-max will-change-transform motion-reduce:w-full"
      >
        {Array.from({ length: copies }, (_, copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? firstCopy : undefined}
            // Repeats stay clickable (not `inert`, which also blocks the mouse) but
            // are hidden from screen readers and the tab order: one list for them.
            aria-hidden={copy > 0 || undefined}
            className={`flex shrink-0 items-center gap-x-10 pr-10 sm:gap-x-14 sm:pr-14 ${
              copy > 0
                ? "motion-reduce:hidden"
                : "motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8 motion-reduce:px-4"
            }`}
          >
            {partners.map((partner) => (
              <li key={`${partner.name}-${partner.href}`}>
                <PartnerLogo
                  partner={partner}
                  newTabLabel={newTabLabel}
                  tabbable={copy === 0}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function PartnerLogo({ partner, newTabLabel, tabbable }: PartnerLogoProps) {

  const logo = (
    <SafeImage
      src={partner.logoUrl}
      alt={partner.name}
      width={144}
      height={44}
      className="h-12 w-28 object-contain opacity-60 sm:h-20 sm:w-48 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      fallback={
        <span className="display flex h-12 w-28 items-center justify-center text-center text-lg sm:h-14 sm:w-36 sm:text-xl text-muted transition-colors group-hover:text-ink">
          {partner.name}
        </span>
      }
    />
  );

  if (!partner.href) return <div className="group">{logo}</div>;

  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={tabbable ? undefined : -1}
      className="group block rounded-md"
    >
      {logo}
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}
