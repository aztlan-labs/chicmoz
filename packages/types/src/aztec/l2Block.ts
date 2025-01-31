import { z } from "zod";
import {
  aztecAddressSchema,
  ethAddressSchema,
  hexStringSchema,
} from "../general.js";
import { deepPartial } from "../utils.js";
import { chicmozL2TxEffectSchema } from "./l2TxEffect.js";
import {
  bufferSchema,
  frNumberSchema,
  frSchema,
  frTimestampSchema,
} from "./utils.js";

export const chicmozL2BlockSchema = z.object({
  hash: hexStringSchema,
  height: z.coerce.bigint().nonnegative(),
  proposedOnL1: z
    .object({
      blockNumber: z.coerce.bigint().nonnegative(),
      timestamp: z.number(),
    })
    .optional(),
  proofVerifiedOnL1: z
    .object({
      blockNumber: z.coerce.bigint().nonnegative(),
      timestamp: z.number(),
      proverId: frSchema,
    })
    .optional(),
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
      numTxs: frNumberSchema,
      blobsHash: bufferSchema,
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
      chainId: frNumberSchema,
      version: frNumberSchema,
      blockNumber: frNumberSchema,
      slotNumber: frNumberSchema,
      timestamp: frTimestampSchema,
      coinbase: ethAddressSchema,
      feeRecipient: aztecAddressSchema,
      gasFees: z.object({
        feePerDaGas: frNumberSchema,
        feePerL2Gas: frNumberSchema,
      }),
    }),
    totalFees: z.coerce.bigint(),
    totalManaUsed: z.coerce.bigint(),
  }),
  body: z.object({
    txEffects: z.array(chicmozL2TxEffectSchema),
  }),
});

export type ChicmozL2Block = z.infer<typeof chicmozL2BlockSchema>;

// NOTE: for testing purposes only
export const partialChicmozL2BlockSchema = deepPartial(chicmozL2BlockSchema);
