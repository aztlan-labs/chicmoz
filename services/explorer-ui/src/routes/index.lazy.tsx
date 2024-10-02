import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useLatestBlock } from "~/hooks/";
import { routes } from "./__root";

const LatestBlockData = () => {
  const { data: latestBlock, isLoading, error } = useLatestBlock();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlock) return <p>No data</p>;

  return (
    <ul className="space-y-2">
      <li>
        <Link to={routes.blocks.route + "/" + parseInt(latestBlock.header.globalVariables.blockNumber, 16)}>
          <strong>Block Number:</strong>{" "}
          {parseInt(latestBlock.header.globalVariables.blockNumber, 16)}
        </Link>
      </li>
      <li>
        <strong>Number of Transactions:</strong>{" "}
        {parseInt(latestBlock.header.contentCommitment.numTxs, 16)}
      </li>
      <li>
        <strong>Total Fees:</strong>{" "}
        {parseInt(latestBlock.header.totalFees, 16)} (wei)
      </li>
      <li>
        <strong>State Root:</strong>{" "}
        {latestBlock.header.state.partial.publicDataTree.root}
      </li>
    </ul>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="text-center mt-16">{text.exploreThePrivacyOnAztec}</h1>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4">Latest Block Data</h2>
        <LatestBlockData />
      </div>
    </div>
  );
}

const text = {
  exploreThePrivacyOnAztec: "Explore the power of privacy on Aztec",
};
