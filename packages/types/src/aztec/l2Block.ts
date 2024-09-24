import { z } from "zod";
import { hexStringSchema } from "../general.js";
import { deepPartial } from "../utils.js";
import { chicmozL2TxEffectSchema } from "./l2TxEffect.js";
import { bufferSchema, frSchema } from "./utils.js";

export const chicmozL2BlockSchema = z.object({
  hash: hexStringSchema,
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

export type ChicmozL2Block = z.infer<typeof chicmozL2BlockSchema>;

// NOTE: for testing purposes only
export const partialChicmozL2BlockSchema = deepPartial(chicmozL2BlockSchema);
