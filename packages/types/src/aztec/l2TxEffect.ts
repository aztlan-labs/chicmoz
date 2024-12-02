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

const logsSchema = (logEntrySchema: typeof noteEncryptedLogEntrySchema | typeof encryptedLogEntrySchema | typeof unencryptedLogEntrySchema) =>
  z.object({
    functionLogs: z.array(
      z.object({
        logs: z.array(logEntrySchema),
      }),
    ),
  });

//const functionSelectorSchema = z.string().length(10).regex(/^0x[0-9a-fA-F]+$/);

export const chicmozL2PendingTxSchema = z.object({
  // TODO: this schema needs to be properly defined, perhaps merged with txEffect
  hash: hexStringSchema,
  birthTimestamp: z.number(),
  //data: bufferSchema,
  //noteEncryptedLogs: logsSchema(noteEncryptedLogEntrySchema),
  //encryptedLogs: logsSchema(encryptedLogEntrySchema),
  //unencryptedLogs: logsSchema(unencryptedLogEntrySchema),
  //contractClassLogs: bufferSchema,
  //clientIvcProof: bufferSchema,
  //enqueuedPublicFunctionCalls: z.array(bufferSchema),
  //publicTeardownFunctionCall: z.object({
  //  callContext: z.object({
  //    msgSender: aztecAddressSchema,
  //    contractAddress: aztecAddressSchema,
  //    functionSelector: functionSelectorSchema,
  //    isStaticCall: z.boolean(),
  //  }),
  //  args: z.array(frSchema),
  //}),
});

/**
  * Represents effects of a transaction on the L2 state.
  */
export const chicmozL2TxEffectSchema = z.object({
  revertCode: z.preprocess(
    (val) => {
      if (typeof val === "number") return { code: val };
      return val;
    },
    z.object({ code: z.number() }),
  ),
  /** The hash of the transaction that caused these effects. */
  hash: hexStringSchema,
  /** The hash of the transaction and its effects. */
  txHash: hexStringSchema,
  txBirthTimestamp: z.number().optional(),
  transactionFee: frNumberSchema,
  noteHashes: z.array(frSchema),
  nullifiers: z.array(frSchema),
  l2ToL1Msgs: z.array(frSchema),
  publicDataWrites: z.array(
    z.object({ leafSlot: frSchema, value: frSchema }),
  ),
  noteEncryptedLogsLength: frNumberSchema,
  encryptedLogsLength: frNumberSchema,
  unencryptedLogsLength: frNumberSchema,
  noteEncryptedLogs: logsSchema(noteEncryptedLogEntrySchema),
  encryptedLogs: logsSchema(encryptedLogEntrySchema),
  unencryptedLogs: logsSchema(unencryptedLogEntrySchema),
});

export type NoteEncryptedLogEntry = z.infer<typeof noteEncryptedLogEntrySchema>;
export type EncryptedLogEntry = z.infer<typeof encryptedLogEntrySchema>;
export type UnencryptedLogEntry = z.infer<typeof unencryptedLogEntrySchema>;

export type ChicmozL2PendingTx = z.infer<typeof chicmozL2PendingTxSchema>;
export type ChicmozL2TxEffect = z.infer<typeof chicmozL2TxEffectSchema>;
