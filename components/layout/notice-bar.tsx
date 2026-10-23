"use client";

import { useState } from "react";
import type { Notice } from "@/lib/api/schema";
import { AlertIcon, CloseIcon, InfoIcon } from "@/components/ui/icons";
import type { NoticeBarProps } from "./types";

// Severity has its own colours, independent of the club's brand: a warning
// must look like a warning on every site.
const tones: Record<Notice["severity"], string> = {
  info: "bg-surface text-ink border-line",
  warning: "bg-[#fff1c7] text-[#4a3500] border-[#e9cf7a]",
  critical: "bg-[#fde3e3] text-[#6b0f15] border-[#f0a9ad]",
};

export function NoticeBar({ message, severity, dismissLabel }: NoticeBarProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const Icon = severity === "info" ? InfoIcon : AlertIcon;

  return (
    <div role={severity === "info" ? "status" : "alert"} className={`border-b ${tones[severity]}`}>
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-2.5 text-sm sm:items-center sm:px-6">
        <Icon className="mt-0.5 size-4 shrink-0 sm:mt-0" />
        <p className="flex-1 leading-snug">{message}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="-my-1 -mr-2 grid size-8 shrink-0 place-items-center rounded-md hover:bg-black/5"
        >
          <CloseIcon className="size-4" />
          <span className="sr-only">{dismissLabel}</span>
        </button>
      </div>
    </div>
  );
}
