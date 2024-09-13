import { type ChicmozL2Block } from "@chicmoz-pkg/types";
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

// const logLogs = (txEffects: ChicmozL2Block["body"]["txEffects"]) => {
//   for (const [txI, tx] of Object.entries(txEffects)) {
//     for (const [fLogI, fLog] of Object.entries(
//       tx.unencryptedLogs.functionLogs
//     )) {
//       for (const [logI, log] of Object.entries(fLog.logs)) {
//         console.log(`tx ${txI} fLog ${fLogI} log ${logI}: `, log);
//       }
//     }
//   }
// };
//
// const logPublicWrites = (txEffects: ChicmozL2Block["body"]["txEffects"]) => {
//   for (const [txI, tx] of Object.entries(txEffects)) {
//     for (const [pubWriteI, pubWrite] of Object.entries(tx.publicDataWrites)) {
//       console.log(`tx ${txI} pubWrite ${pubWriteI}: `, pubWrite);
//       for (const [logI, log] of Object.entries(
//         tx.unencryptedLogs.functionLogs[Number(pubWriteI)].logs
//       )) {
//         console.log(`\tlog ${logI}: `, log);
//       }
//     }
//   }
// };

export const useLatestBlock = () => {
  const [latestBlockData, setLatestBlockData] = useState<ChicmozL2Block | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBlock = useCallback(async () => {
    try {
      const block = await getLatestBlock();
      //console.log("block", block);
      if (
        !block ||
        latestBlockData?.header?.globalVariables?.blockNumber ===
          block?.header?.globalVariables?.blockNumber
      )
        return;

      console.log(block);
      //logPublicWrites(block.body.txEffects);
      setLatestBlockData(block);
      setError(null);
    } catch (err) {
      console.error("Error fetching latest block:", err);
      setError("Failed to fetch latest block. Please try again later.");
      setLatestBlockData(null);
    } finally {
      setLoading(false);
    }
  }, [latestBlockData?.header?.globalVariables?.blockNumber]);

  useEffect(() => {
    fetchLatestBlock(); // Fetch immediately on mount
    const intervalId = setInterval(fetchLatestBlock, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchLatestBlock]);

  let timeSince = "no timestamp";
  if (latestBlockData) {
    const now = new Date().getTime();
    const blockTime = new Date(
      parseInt(latestBlockData.header.globalVariables.timestamp, 16) * 1000
    ).getTime();
    timeSince = formatTimeSince(Math.round((now - blockTime) / 1000));
  }

  return {
    latestBlockData,
    loading,
    error,
    timeSince,
  };
};
