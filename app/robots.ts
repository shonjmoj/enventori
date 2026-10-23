import type { MetadataRoute } from "next";

// Same rules on every club's host.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
