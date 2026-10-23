import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  images: {
    // AVIF first: ~20–40% lighter than WebP for these photos.
    formats: ["image/avif", "image/webp"],
    // Default list plus common laptop widths (1280–1680): the full-bleed hero
    // otherwise jumps from 1200 straight to the 1920 file on a 1366px screen.
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1366, 1440, 1536, 1680, 1920, 2048, 3840],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
