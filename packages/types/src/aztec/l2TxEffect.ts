import { z } from "zod";
import { hexStringSchema } from "../general.js";
import { aztecAddressSchema, frNumberSchema, frSchema } from "./utils.js";
import { chicmozL2BlockSchema } from "./l2Block.js";

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

export const chicmozL2TxEffectSchema = z.object({
  revertCode: z.preprocess(
    (val) => {
      if (typeof val === "number") return { code: val };
      return val;
    },
    z.object({ code: z.number() }),
  ),
  hash: hexStringSchema,
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

export const chicmozL2TxEffectDeluxeSchema = z.object({
  ...chicmozL2TxEffectSchema.shape,
  blockHeight: chicmozL2BlockSchema.shape.height,
  timestamp: chicmozL2BlockSchema.shape.header.shape.globalVariables.shape.timestamp,
});

export type NoteEncryptedLogEntry = z.infer<typeof noteEncryptedLogEntrySchema>;
export type EncryptedLogEntry = z.infer<typeof encryptedLogEntrySchema>;
export type UnencryptedLogEntry = z.infer<typeof unencryptedLogEntrySchema>;

export type ChicmozL2TxEffect = z.infer<typeof chicmozL2TxEffectSchema>;
export type ChicmozL2TxEffectDeluxe = z.infer<typeof chicmozL2TxEffectDeluxeSchema>;
