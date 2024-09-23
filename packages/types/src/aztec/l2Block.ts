import { z } from "zod";
import { deepPartial } from "../utils.js";
import { bufferSchema, frSchema } from "./utils.js";

export const noteEncryptedLogEntrySchema = z.object({
  data: z.string(),
});

export const encryptedLogEntrySchema = z.object({
  data: z.string(),
  maskedContractAddress: frSchema,
});

export const unencryptedLogEntrySchema = z.object({
  data: z.string(),
  contractAddress: z.string(),
});

export const chicmozL2TxEffectSchema = z.object({
  revertCode: z.preprocess(
    (val) => {
      if (typeof val === "number") return { code: val };
      return val;
    },
    z.object({ code: z.number() })
  ),
  txHash: z.string(),
  transactionFee: frSchema,
  noteHashes: z.array(frSchema),
  nullifiers: z.array(frSchema),
  l2ToL1Msgs: z.array(frSchema),
  publicDataWrites: z.array(
    z.object({ leafIndex: frSchema, newValue: frSchema })
  ),
  noteEncryptedLogsLength: frSchema,
  encryptedLogsLength: frSchema,
  unencryptedLogsLength: frSchema,
  noteEncryptedLogs: z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(noteEncryptedLogEntrySchema),
      })
    ),
  }),
  encryptedLogs: z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(encryptedLogEntrySchema),
      })
    ),
  }),
  unencryptedLogs: z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(unencryptedLogEntrySchema),
      })
    ),
  }),
});

export const chicmozL2BlockSchema = z.object({
  hash: z.string(),
  height: z.number(),
  archive: z.object({
    root: frSchema,
    nextAvailableLeafIndex: z.number(),
  }),
  header: z.object({
    lastArchive: z.object({
      root: frSchema,
      nextAvailableLeafIndex: z.number(),
    }),
    contentCommitment: z.object({
      numTxs: frSchema,
      txsEffectsHash: bufferSchema,
      inHash: bufferSchema,
      outHash: bufferSchema,
    }),
    state: z.object({
      l1ToL2MessageTree: z.object({
        root: frSchema,
        nextAvailableLeafIndex: z.number(),
      }),
      partial: z.object({
        noteHashTree: z.object({
          root: frSchema,
          nextAvailableLeafIndex: z.number(),
        }),
        nullifierTree: z.object({
          root: frSchema,
          nextAvailableLeafIndex: z.number(),
        }),
        publicDataTree: z.object({
          root: frSchema,
          nextAvailableLeafIndex: z.number(),
        }),
      }),
    }),
    globalVariables: z.object({
      chainId: z.string(),
      version: z.string(),
      blockNumber: frSchema,
      slotNumber: frSchema,
      timestamp: frSchema,
      coinbase: z.string(),
      feeRecipient: z.string(),
      gasFees: z.object({
        feePerDaGas: frSchema,
        feePerL2Gas: frSchema,
      }),
    }),
    totalFees: frSchema,
  }),
  body: z.object({
    txEffects: z.array(chicmozL2TxEffectSchema),
  }),
});

export type NoteEncryptedLogEntry = z.infer<typeof noteEncryptedLogEntrySchema>;
export type EncryptedLogEntry = z.infer<typeof encryptedLogEntrySchema>;
export type UnencryptedLogEntry = z.infer<typeof unencryptedLogEntrySchema>;

export type ChicmozL2TxEffect = z.infer<typeof chicmozL2TxEffectSchema>;

export type ChicmozL2Block = z.infer<typeof chicmozL2BlockSchema>;

// NOTE: for testing purposes only
export const partialChicmozL2BlockSchema = deepPartial(chicmozL2BlockSchema);
