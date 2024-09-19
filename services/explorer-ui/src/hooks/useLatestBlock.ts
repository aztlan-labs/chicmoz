import { type ChicmozL2Block } from "@chicmoz-pkg/types";
import { useCallback, useEffect, useState } from "react";
import { getLatestBlock, getTransactionByHeightAndIndex } from "~/service/api";

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
//

export const useLatestBlock = () => {
  const [latestBlockData, setLatestBlockData] = useState<ChicmozL2Block | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockedChicmozL2Block = {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    height: 1000000,
    archive: {
      root: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
      nextAvailableLeafIndex: 500000,
    },
    header: {
      lastArchive: {
        root: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        nextAvailableLeafIndex: 499999,
      },
      contentCommitment: {
        numTxs: "0x1234",
        txsEffectsHash: Buffer.from("deadbeef", "hex"),
        inHash: Buffer.from("cafebabe", "hex"),
        outHash: Buffer.from("baaaaaad", "hex"),
      },
      state: {
        l1ToL2MessageTree: {
          root: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
          nextAvailableLeafIndex: 100000,
        },
        partial: {
          noteHashTree: {
            root: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
            nextAvailableLeafIndex: 200000,
          },
          nullifierTree: {
            root: "0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210",
            nextAvailableLeafIndex: 150000,
          },
          publicDataTree: {
            root: "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
            nextAvailableLeafIndex: 300000,
          },
        },
      },
      globalVariables: {
        chainId: "chicmoz-testnet-1",
        version: "1.0.0",
        blockNumber: "0x98765",
        slotNumber: "0xabcde",
        timestamp: "0xfedcba",
        coinbase: "0x1234567890123456789012345678901234567890",
        feeRecipient: "0x0987654321098765432109876543210987654321",
        gasFees: {
          feePerDaGas: "0x1111",
          feePerL2Gas: "0x2222",
        },
      },
      totalFees: "0x333333",
    },
    body: {
      txEffects: [
        {
          revertCode: { code: 0 },
          transactionFee: "0x4444",
          noteHashes: ["0xaaaa", "0xbbbb", "0xcccc"],
          nullifiers: ["0xdddd", "0xeeee"],
          l2ToL1Msgs: ["0xffff", "0x1111"],
          publicDataWrites: [
            { leafIndex: "0x2222", newValue: "0x3333" },
            { leafIndex: "0x4444", newValue: "0x5555" },
          ],
          noteEncryptedLogsLength: "0x6666",
          encryptedLogsLength: "0x7777",
          unencryptedLogsLength: "0x8888",
          noteEncryptedLogs: {
            functionLogs: [
              {
                logs: [
                  {
                    /* Placeholder for noteEncryptedLogEntrySchema */
                  },
                  {
                    /* Placeholder for noteEncryptedLogEntrySchema */
                  },
                ],
              },
            ],
          },
          encryptedLogs: {
            functionLogs: [
              {
                logs: [
                  {
                    /* Placeholder for encryptedLogEntrySchema */
                  },
                  {
                    /* Placeholder for encryptedLogEntrySchema */
                  },
                ],
              },
            ],
          },
          unencryptedLogs: {
            functionLogs: [
              {
                logs: [
                  {
                    /* Placeholder for unencryptedLogEntrySchema */
                  },
                  {
                    /* Placeholder for unencryptedLogEntrySchema */
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  };

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
      if (block.body.txEffects.length > 0) {
        const tx = getTransactionByHeightAndIndex(block.height, 0);
        console.log(JSON.stringify(tx));
      }

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
    void fetchLatestBlock(); // Fetch immediately on mount
    const intervalId = setInterval(fetchLatestBlock, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchLatestBlock]);

  let timeSince = "no timestamp";
  if (latestBlockData) {
    const now = new Date().getTime();
    const blockTime = new Date(
      parseInt(latestBlockData.header.globalVariables.timestamp, 16) * 1000,
    ).getTime();
    timeSince = formatTimeSince(Math.round((now - blockTime) / 1000));
  }

  return {
    latestBlockData,
    mockedChicmozL2Block,
    loading,
    error,
    timeSince,
  };
};
