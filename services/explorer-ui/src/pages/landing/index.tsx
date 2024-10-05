import { FC } from "react";
import { blockSchema } from "~/components/blocks/blocks-schema";
import { BlocksTable } from "~/components/blocks/blocks-table";
import { useLatestBlocks } from "~/hooks";

export const Landing: FC = () => {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;

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
      <div className="flex flex-row flex-wrap justify-center gap-2 m-8">
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Total TX-Effects</p>
          <h2 className="text-primary">33952</h2>
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>TX-Effects last 24 hours </p>
          <h2 className="text-primary">342</h2>
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Total amount of contracts</p>
          <h2 className="text-primary">0.000012245</h2>
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Average fee's</p>
          <h2 className="text-primary">0.000012245</h2>
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Average block time</p>
          <h2 className="text-primary">0.000012245</h2>
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Todo</p>
          <h2 className="text-primary">0.000012245</h2>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
          <h2>Latest Blocks</h2>
          <BlocksTable blocks={blocks} />
        </div>

        <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
          <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
            <h2>Latest TX-Effects</h2>
            <BlocksTable blocks={blocks} />
          </div>
        </div>
      </div>
    </div>
  );
};
