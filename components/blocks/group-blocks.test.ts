import { describe, expect, it } from "vitest";
import { groupBlocks } from "./group-blocks";
import type { Layout } from "./types";

const layouts: Record<string, Layout | null> = { promo: "tile", newsletter: "tile", video: "full", partners: "full" };
const blocks = (types: string[]) => types.map((type, i) => ({ type, id: `${i}` }));

describe("groupBlocks", () => {
  it("keeps order, merges consecutive tiles, drops unknown types", () => {
    const runs = groupBlocks(
      blocks(["promo", "video", "promo", "newsletter", "countdown", "partners"]),
      (b) => layouts[b.type] ?? null,
    );
    expect(runs.map((r) => [r.layout, r.blocks.map((b) => b.type)])).toEqual([
      ["tile", ["promo"]],
      ["full", ["video"]],
      ["tile", ["promo", "newsletter"]],
      ["full", ["partners"]],
    ]);
  });
});
