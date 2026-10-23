"use client";

import Image from "next/image";
import { useState } from "react";
import type { SafeImageProps } from "./types";

/** Any image URL from the API can be null or broken. */
export function SafeImage({ src, fallback = null, alt, ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <>{fallback}</>;

  // Logos and crests are SVGs of unknown aspect ratio: the optimizer adds
  // nothing for vectors, and a plain <img> can size itself from its CSS.
  if (src.endsWith(".svg") && !props.fill) {
    const { width, height, className, preload } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={preload ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return <Image {...props} src={src} alt={alt} onError={() => setFailedSrc(src)} />;
}
