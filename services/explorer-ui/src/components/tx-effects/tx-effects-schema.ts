import {
  type ChicmozL2Block,
  type ChicmozL2TxEffect,
} from "@chicmoz-pkg/types";
import { z } from "zod";

export type TxEffectTableSchema = z.infer<typeof txEffectSchema>;

export const getTxEffectTableObj = (
  txEffect: ChicmozL2TxEffect,
  block: ChicmozL2Block
): TxEffectTableSchema => {
  return txEffectSchema.parse({
    hash: txEffect.hash,
    transactionFee: txEffect.transactionFee,
    totalLengthOfLogs:
      txEffect.encryptedLogsLength +
      txEffect.unencryptedLogsLength +
      txEffect.noteEncryptedLogsLength,
    blockNumber: block.height,
    timestamp: block.header.globalVariables.timestamp,
  });
};

const txEffectSchema = z.object({
  hash: z.string(),
  transactionFee: z.number(),
  totalLengthOfLogs: z.number(),
  blockNumber: z.number(),
  timestamp: z.number(),
});
