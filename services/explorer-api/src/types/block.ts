/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fr as FrType } from "@aztec/aztec.js";
import { z } from "zod";

declare module "@aztec/aztec.js" {
  const Fr: {
    fromString(val: string): FrType;
  };
  interface Fr {
    toString(): string;
  }
  interface L2Block {
    hash(): Fr;
  }
}

const FrSchema = z
  .preprocess(
    (val) => {
      if (typeof val === "string") return { type: "Fr", value: val };
      return val;
    },
    z.object({
      type: z.literal("Fr"),
      value: z.string(),
    })
  )
  .transform((val, ctx): FrType => {
    try {
      return FrType.fromString(val.value);
    } catch (e) {
      let errorMessage = (e as string) || "Failed to do something exceptional";
      if (e instanceof Error) errorMessage = e.message;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessage,
      });
      return z.NEVER;
    }
  });

const bufferSchema = z.custom<Buffer>((value) => {
  return value instanceof Buffer;
}, { message: "Expected a Buffer" });

export const reconstructedL2BlockSchema = z.object({
  archive: z.object({
    root: FrSchema,
    nextAvailableLeafIndex: z.number(),
  }),
  header: z.object({
    lastArchive: z.object({
      root: FrSchema,
      nextAvailableLeafIndex: z.number(),
    }),
    contentCommitment: z.object({
      numTxs: FrSchema,
      txsEffectsHash: bufferSchema,
      inHash: bufferSchema,
      outHash: bufferSchema,
    }),
    state: z.object({
      l1ToL2MessageTree: z.object({
        root: FrSchema,
        nextAvailableLeafIndex: z.number(),
      }),
      partial: z.object({
        noteHashTree: z.object({
          root: FrSchema,
          nextAvailableLeafIndex: z.number(),
        }),
        nullifierTree: z.object({
          root: FrSchema,
          nextAvailableLeafIndex: z.number(),
        }),
        publicDataTree: z.object({
          root: FrSchema,
          nextAvailableLeafIndex: z.number(),
        }),
      }),
    }),
    globalVariables: z.object({
      chainId: z.string(),
      version: z.string(),
      blockNumber: FrSchema,
      slotNumber: FrSchema,
      timestamp: FrSchema,
      coinbase: z.string(),
      feeRecipient: z.string(),
      gasFees: z.object({
        feePerDaGas: z.string(),
        feePerL2Gas: z.string(),
      }),
    }),
    totalFees: FrSchema,
  }),
  body: z.object({
    txEffects: z.array(
      z.object({
        revertCode: z.object({ code: z.number() }),
        transactionFee: FrSchema,
        noteHashes: z.array(FrSchema),
        nullifiers: z.array(FrSchema),
        l2ToL1Msgs: z.array(FrSchema),
        publicDataWrites: z.array(FrSchema),
        noteEncryptedLogsLength: FrSchema,
        encryptedLogsLength: FrSchema,
        unencryptedLogsLength: FrSchema,
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
              logs: z.array(
                z.object({
                  data: z.string(),
                  maskedContractAddress: FrSchema,
                })
              ),
            })
          ),
        }),
        unencryptedLogs: z.object({
          functionLogs: z.array(
            z.object({
              logs: z.array(
                z.object({
                  data: z.string(),
                  contractAddress: z.string(),
                })
              ),
            })
          ),
        }),
      })
    ),
  }),
});

export type ReconstructedL2Block = z.infer<typeof reconstructedL2BlockSchema>;
