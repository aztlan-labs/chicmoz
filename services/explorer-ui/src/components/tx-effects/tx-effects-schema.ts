import {
  type ChicmozL2BlockLight,
  type ChicmozL2TxEffect,
} from "@chicmoz-pkg/types";
import { z } from "zod";

export type TxEffectTableSchema = z.infer<typeof txEffectSchema>;

export const getTxEffectTableObj = (
  txEffect: ChicmozL2TxEffect,
  block: ChicmozL2BlockLight
): TxEffectTableSchema => {
  return txEffectSchema.parse({
    hash: txEffect.hash,
    txHash: txEffect.txHash,
    transactionFee: txEffect.transactionFee,
    blockNumber: block.height,
    timestamp: block.header.globalVariables.timestamp,
  });
};

const txEffectSchema = z.object({
  hash: z.string(),
  txHash: z.string(),
  transactionFee: z.number(),
  blockNumber: z.number(),
  timestamp: z.number(),
});
