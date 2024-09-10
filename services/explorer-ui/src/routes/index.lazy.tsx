import { createLazyFileRoute } from "@tanstack/react-router";
import { useLatestBlock } from "~/hooks/useLatestBlock";

const LatestBlockData = () => {
  const { latestBlockData, loading, error, timeSince } = useLatestBlock();

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Latest Block Data</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {latestBlockData && (
        <ul className="space-y-2">
          <li>
            <strong>Block Number:</strong>{" "}
            {parseInt(latestBlockData.header.globalVariables.blockNumber, 16)}
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
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="text-center mt-16">{text.exploreThePrivacyOnAztec}</h1>
      <LatestBlockData />
    </div>
  );
}

const text = {
  exploreThePrivacyOnAztec: "Explore the power of privacy on Aztec",
};
