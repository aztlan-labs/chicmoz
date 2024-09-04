/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { Fr } from "@aztec/aztec.js";
import { logger } from "./logger.js";

// Utility function to recursively apply .partial() to a Zod schema
function deepPartial(schema: z.ZodType<any, any>): z.ZodType<any, any> {
  if (schema instanceof z.ZodObject) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const shape = schema.shape;
    const newShape: Record<string, z.ZodType<any, any>> = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const key in shape) newShape[key] = deepPartial(shape[key]);

    return z.object(newShape).partial();
  } else if (schema instanceof z.ZodArray) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return z.array(deepPartial(schema.element));
  } else if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return deepPartial(schema._def.innerType).optional();
  } else {
    return schema.optional();
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
  .transform((val, ctx) => {
    try {
      return Fr.fromString(val.value);
    } catch (e) {
      logger.info(`!!!!!! ${val.value}`);
      let errorMessage = (e as string) || "Failed to do something exceptional";
      if (e instanceof Error) errorMessage = e.message;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessage,
      });
      return z.NEVER;
    }
  });

export const blockSchema = z.object({
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
        l2ToL1Msgs: z.array(z.unknown()),
        publicDataWrites: z.array(z.unknown()),
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

export const partialBlockSchema = deepPartial(blockSchema);
export type Block = z.infer<typeof blockSchema>;
