import { z } from "zod";
import { deepPartial } from "../utils.js";

// TODO: separate type for transaction?

type AztecFr = {
  toString(): string;
};

type StringifiedAztecFr = {
  type: "Fr";
  value: string;
};

const frSchema = z.preprocess(
  (val) => {
    if ((val as StringifiedAztecFr).value)
      return (val as StringifiedAztecFr).value;
    else if ((val as AztecFr).toString) return (val as AztecFr).toString();
    else return val;
  },
  z
    .string()
    .length(66)
    .regex(/^0x[0-9a-fA-F]+$/)
);

type StringifiedBuffer = {
  type: "Buffer";
  data: number[];
};

const bufferSchema = z.preprocess(
  (val) => {
    if ((val as StringifiedBuffer).data)
      return Buffer.from((val as StringifiedBuffer).data);
    return val;
  },
  z.custom<Buffer>(
    (value) => {
      return value instanceof Buffer;
    },
    { message: "Expected a Buffer" }
  )
);

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

export type NoteEncryptedLogEntry = z.infer<typeof noteEncryptedLogEntrySchema>;
export type EncryptedLogEntry = z.infer<typeof encryptedLogEntrySchema>;
export type UnencryptedLogEntry = z.infer<typeof unencryptedLogEntrySchema>;

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
    txEffects: z.array(
      z.object({
        revertCode: z.preprocess(
          (val) => {
            if (typeof val === "number") return { code: val };
            return val;
          },
          z.object({ code: z.number() })
        ),
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
      })
    ),
  }),
});

export type ChicmozL2Block = z.infer<typeof chicmozL2BlockSchema>;

// NOTE: for testing purposes only
export const partialChicmozL2BlockSchema = deepPartial(chicmozL2BlockSchema);
