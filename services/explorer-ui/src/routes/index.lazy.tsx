import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getLatestBlock } from "~/service/api";

const formatTimeSince = (seconds: number) => {

  const intervals = [
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

const LatestBlockData = () => {
  const [latestBlockData, setLatestBlockData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBlock = useCallback(async () => {
    try {
      const block = await getLatestBlock();
      if (!block || latestBlockData?.number === block.number) return;

      setLatestBlockData(block);
      setError(null);
    } catch (err) {
      console.error("Error fetching latest block:", err);
      setError("Failed to fetch latest block. Please try again later.");
      setLatestBlockData(null);
    } finally {
      setLoading(false);
    }
  }, [latestBlockData?.number]);

  useEffect(() => {
    fetchLatestBlock(); // Fetch immediately on mount
    const intervalId = setInterval(fetchLatestBlock, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchLatestBlock]);

  let timeSince = "no timestamp";
  if (latestBlockData) {

    const now = new Date().getTime();
    const blockTime = new Date(
      parseInt(latestBlockData.timestamp * 1000)
    ).getTime();
    timeSince = formatTimeSince(
      Math.round(
        (now - blockTime) / 1000
      )
    );
  }

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
            {parseInt(
              latestBlockData.header.contentCommitment.numTxs.value,
              16
            )}
          </li>
          <li>
            <strong>Total Fees:</strong>{" "}
            {parseInt(latestBlockData.header.totalFees.value, 16)} (wei)
          </li>
          <li>
            <strong>State Root:</strong>{" "}
            {latestBlockData.header.state.partial.noteHashTree.root.value}
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
