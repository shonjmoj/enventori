import type { BlockRun, Layout } from "./types";

/** Keeps array order; merges consecutive tiles so they can share a grid row. */
export function groupBlocks<B>(blocks: B[], layoutOf: (block: B) => Layout | null): BlockRun<B>[] {
  const runs: BlockRun<B>[] = [];
  for (const block of blocks) {
    const layout = layoutOf(block);
    if (layout === null) continue;
    const last = runs.at(-1);
    if (layout === "tile" && last?.layout === "tile") {
      last.blocks.push(block);
    } else {
      runs.push(layout === "tile" ? { layout, blocks: [block] } : { layout, blocks: [block] });
    }
  }
  return runs;
}
