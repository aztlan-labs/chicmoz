import { z } from "zod";

// TODO: unknowns
// TODO: separate type for transaction?

type AztecFr = {
  toString(): string;
};

type StringifiedAztecFr = {
  type: "Fr";
  value: string;
};

const bigIntFrProcess = z.preprocess((val) => {
  if (typeof val === "string" && val.startsWith("0x")) return BigInt(val);
  else if ((val as AztecFr).toString)
    return BigInt((val as AztecFr).toString());
  else if ((val as StringifiedAztecFr).value)
    return BigInt((val as StringifiedAztecFr).value);
  else return BigInt((val as number)); ;
  // TODO: perhaps should be `0xstring`?
}, z.bigint());

export const blockSchema = z.object({
  archive: z.object({
    root: bigIntFrProcess,
    nextAvailableLeafIndex: z.number(),
  }),
  header: z.object({
    lastArchive: z.object({
      root: bigIntFrProcess,
      nextAvailableLeafIndex: z.number(),
    }),
    contentCommitment: z.object({
      numTxs: bigIntFrProcess,
      txsEffectsHash: z.object({
        type: z.literal("Buffer"),
        data: z.array(z.number()),
      }),
      inHash: z.object({
        type: z.literal("Buffer"),
        data: z.array(z.number()),
      }),
      outHash: z.object({
        type: z.literal("Buffer"),
        data: z.array(z.number()),
      }),
    }),
    state: z.object({
      l1ToL2MessageTree: z.object({
        root: bigIntFrProcess,
        nextAvailableLeafIndex: z.number(),
      }),
      partial: z.object({
        noteHashTree: z.object({
          root: bigIntFrProcess,
          nextAvailableLeafIndex: z.number(),
        }),
        nullifierTree: z.object({
          root: bigIntFrProcess,
          nextAvailableLeafIndex: z.number(),
        }),
        publicDataTree: z.object({
          root: bigIntFrProcess,
          nextAvailableLeafIndex: z.number(),
        }),
      }),
    }),
    globalVariables: z.object({
      chainId: z.string(),
      version: z.string(),
      blockNumber: bigIntFrProcess,
      slotNumber: bigIntFrProcess,
      timestamp: bigIntFrProcess,
      coinbase: z.string(),
      feeRecipient: z.string(),
      gasFees: z.object({
        feePerDaGas: z.string(),
        feePerL2Gas: z.string(),
      }),
    }),
    totalFees: bigIntFrProcess,
  }),
  body: z.object({
    txEffects: z.array(
      z.object({
        revertCode: z.object({ code: z.number() }),
        transactionFee: bigIntFrProcess,
        noteHashes: z.array(bigIntFrProcess),
        nullifiers: z.array(bigIntFrProcess),
        l2ToL1Msgs: z.array(z.unknown()),
        publicDataWrites: z.array(z.unknown()),
        noteEncryptedLogsLength: bigIntFrProcess,
        encryptedLogsLength: bigIntFrProcess,
        unencryptedLogsLength: bigIntFrProcess,
        noteEncryptedLogs: z.object({
          functionLogs: z.array(
            z.object({
              logs: z.array(
                z.object({
                  data: z.string(),
                })
              ),
            })
          ),
        }),
        encryptedLogs: z.object({
          functionLogs: z.array(
            z.object({
              logs: z.array(z.unknown()),
            })
          ),
        }),
        unencryptedLogs: z.object({
          functionLogs: z.array(
            z.object({
              logs: z.array(z.unknown()),
            })
          ),
        }),
      })
    ),
  }),
});

export type Block = z.infer<typeof blockSchema>;
