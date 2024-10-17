import { type ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";

export const getTxEffectData = (data: ChicmozL2TxEffectDeluxe) => [
  {
    label: "HASH",
    value: data.hash,
  },
  {
    label: "TRANSACTION FEE (FPA)",
    value: data.transactionFee.toString(),
  },
  { label: "BLOCK NUMBER", value: data.blockHeight.toString() },
  { label: "TIMESTAMP", value: data.timestamp.toString() },
];
