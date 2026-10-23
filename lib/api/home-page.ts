import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { homePageSchema, type HomePage } from "./schema";

/*
 * Stand-in for the backend: each `data/<slug>.json` is what the API returns for
 * one club. Swapping this for a `fetch` keeps the same contract, because
 * everything downstream only sees the parsed `HomePage`.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function listClubSlugs(): Promise<string[]> {
  "use cache";
  const files = await readdir(DATA_DIR);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.slice(0, -".json".length))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort();
}

/** Returns `null` when the club doesn't exist. Throws if its payload is unusable. */
export async function getHomePage(slug: string): Promise<HomePage | null> {
  "use cache";
  if (!SLUG_PATTERN.test(slug)) return null;

  let raw: string;
  try {
    raw = await readFile(path.join(DATA_DIR, `${slug}.json`), "utf8");
  } catch {
    return null;
  }
  return parseHomePage(JSON.parse(raw));
}

export function parseHomePage(payload: unknown): HomePage {
  return homePageSchema.parse(payload);
}
