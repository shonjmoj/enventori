"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/ui/icons";
import { SafeImage } from "@/components/ui/safe-image";
import type { VideoPlayerProps } from "./types";

/** Poster first: the third-party player (and its cookies) only loads on click. */
export function VideoPlayer({ embedUrl, posterUrl, title, playLabel }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-scrim">
      {playing ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 size-full">
          <SafeImage src={posterUrl} alt="" fill sizes="(min-width: 1152px) 1104px, calc(100vw - 32px)" className="object-cover" />
          <span className="absolute inset-0 bg-scrim/30 transition-colors group-hover:bg-scrim/15" />
          <span className="absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-action-inverse text-on-action-inverse shadow-lg transition-transform group-hover:scale-105 sm:size-24">
            <PlayIcon className="size-8 sm:size-10" />
          </span>
          <span className="sr-only">{playLabel}</span>
        </button>
      )}
    </div>
  );
}
