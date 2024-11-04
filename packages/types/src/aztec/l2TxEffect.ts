import { z } from "zod";
import { hexStringSchema } from "../general.js";
import { aztecAddressSchema, frNumberSchema, frSchema } from "./utils.js";

export const noteEncryptedLogEntrySchema = z.object({
  data: z.string(),
});

export const encryptedLogEntrySchema = z.object({
  data: z.string(),
  maskedContractAddress: frSchema,
});

export const unencryptedLogEntrySchema = z.object({
  data: z.string(),
  contractAddress: aztecAddressSchema,
});

export const chicmozL2PendingTxSchema = z.object({
  hash: hexStringSchema,
  data: z.string(),
  noteEncryptedLogs: z.string(),
  encryptedLogs: z.string(),
  unencryptedLogs: z.string(),
  clientIvcProof: z.string(),
  enqueuedPublicFunctions: z.array(z.string()),
  publicTeardownFunctionCall: z.string(),
});

export const chicmozL2TxEffectSchema = z.object({
  revertCode: z.preprocess(
    (val) => {
      if (typeof val === "number") return { code: val };
      return val;
    },
    z.object({ code: z.number() }),
  ),
  hash: hexStringSchema,
  txHash: hexStringSchema.optional(), // TODO: remove optional
  transactionFee: frNumberSchema,
  noteHashes: z.array(frSchema),
  nullifiers: z.array(frSchema),
  l2ToL1Msgs: z.array(frSchema),
  publicDataWrites: z.array(
    z.object({ leafIndex: frSchema, newValue: frSchema }),
  ),
  noteEncryptedLogsLength: frNumberSchema,
  encryptedLogsLength: frNumberSchema,
  unencryptedLogsLength: frNumberSchema,
  noteEncryptedLogs: z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(noteEncryptedLogEntrySchema),
      }),
    ),
  }),
  encryptedLogs: z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(encryptedLogEntrySchema),
      }),
    ),
  }),
  unencryptedLogs: z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(unencryptedLogEntrySchema),
      }),
    ),
  }),
});

export type NoteEncryptedLogEntry = z.infer<typeof noteEncryptedLogEntrySchema>;
export type EncryptedLogEntry = z.infer<typeof encryptedLogEntrySchema>;
export type UnencryptedLogEntry = z.infer<typeof unencryptedLogEntrySchema>;

export type ChicmozL2PendingTx = z.infer<typeof chicmozL2PendingTxSchema>;
export type ChicmozL2TxEffect = z.infer<typeof chicmozL2TxEffectSchema>;
