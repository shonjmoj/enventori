import type { Block, KnownBlockType } from "@/lib/api/schema";
import type { PageContext } from "@/lib/page-context";
import { groupBlocks } from "./group-blocks";
import { blockRegistry } from "./registry";
import type { KnownBlock } from "./types";

function definitionOf(block: Block) {
  if (block.type === "unknown") {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[blocks] Skipping unsupported block type "${block.rawType}" (${block.id})`);
    }
    return null;
  }
  return blockRegistry[block.type as KnownBlockType];
}

function renderBlock(block: KnownBlock, ctx: PageContext, wide: boolean) {
  // The registry is keyed by type, so the component always matches its block.
  const { Component } = blockRegistry[block.type] as unknown as {
    Component: (props: { block: KnownBlock; ctx: PageContext; wide?: boolean }) => React.ReactNode;
  };
  return <Component key={block.id} block={block} ctx={ctx} wide={wide} />;
}

const gridColumns: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
};

/** Content chosen by the club's marketing team, in the order they chose. */
export function BlockList({ blocks, ctx }: { blocks: Block[]; ctx: PageContext }) {
  const runs = groupBlocks(blocks, (block) => definitionOf(block)?.layout ?? null);

  return runs.map((run) => {
    const first = run.blocks[0] as KnownBlock;
    if (run.layout === "full") return renderBlock(first, ctx, true);

    const wide = run.blocks.length === 1;
    return (
      <div key={first.id} className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className={`grid gap-4 sm:gap-5 ${gridColumns[Math.min(run.blocks.length, 3)] ?? ""}`}>
          {run.blocks.map((block) => renderBlock(block as KnownBlock, ctx, wide))}
        </div>
      </div>
    );
  });
}
