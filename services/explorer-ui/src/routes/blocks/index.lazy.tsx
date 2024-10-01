import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { blockSchema } from "~/components/blocks/blocks-schema";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";
import { useLatestBlocks } from "~/hooks";

export const Route = createLazyFileRoute("/blocks/")({
  component: Blocks,
});

function Blocks() {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();
  let isIndex = true;
  try {
    const params = useParams({ from: "/blocks/$blockNumber" });
    isIndex = !params.blockNumber;
  } catch (e) {
    console.error(e);
    isIndex = true;
  }
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;

  const text = {
    title: isIndex ? "All blocks" : "Block Details",
  };

  const blocks = latestBlocks.map((block) => {
    return blockSchema.parse({
      height: block.height,
      blockHash: block.hash,
      numberOfTransactions: block.header.contentCommitment.numTxs,
      txEffectsLength: block.body.txEffects.length,
      totalFees: block.header.totalFees,
      timestamp: block.header.globalVariables.timestamp,
    });
  });

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      {isIndex ? <BlocksTable blocks={blocks} /> : <Outlet />}
    </div>
  );
}
