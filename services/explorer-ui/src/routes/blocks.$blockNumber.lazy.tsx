import { createLazyFileRoute } from "@tanstack/react-router";
import { useLatestBlock } from "~/hooks/useLatestBlock";

export const Route = createLazyFileRoute("/blocks/$blockNumber")({
  component: Block,
});

function Block() {
  const { latestBlockData, loading, error, timeSince } = useLatestBlock();
  const { blockNumber } = Route.useParams();
  console.log("blockNumber", blockNumber);

  let bn;
  if (blockNumber === "latest") bn = "latest";
  else if (parseInt(blockNumber)) bn = parseInt(blockNumber);

  return (
    <div className="bg-card p-4">
      {bn ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Latest Block Data</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {latestBlockData && (
            <ul className="space-y-2">
              <li>
                <strong>Block Number:</strong>{" "}
                {parseInt(
                  latestBlockData.header.globalVariables.blockNumber,
                  16
                )}
              </li>
              <li>
                <strong>Time since:</strong> {timeSince}
              </li>
              <li>
                <strong>Number of Transactions:</strong>{" "}
                {parseInt(latestBlockData.header.contentCommitment.numTxs, 16)}
              </li>
              <li>
                <strong>Total Fees:</strong>{" "}
                {parseInt(latestBlockData.header.totalFees, 16)} (wei)
              </li>
              <li>
                <strong>State Root:</strong>{" "}
                {latestBlockData.header.state.partial.publicDataTree.root}
              </li>
            </ul>
          )}
        </div>
      ) : (
        <div>
          <h2>Invalid Block Number</h2>
          <p>Block {blockNumber} not found</p>
        </div>
      )}
    </div>
  );
}
