import { readFileSync } from "node:fs";
import path from "node:path";
import { parseHomePage } from "@/lib/api/home-page";

export function loadClub(slug: string) {
  const raw = readFileSync(path.join(__dirname, "..", "data", `${slug}.json`), "utf8");
  return parseHomePage(JSON.parse(raw));
}
