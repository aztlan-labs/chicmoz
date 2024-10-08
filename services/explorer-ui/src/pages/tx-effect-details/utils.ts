import { ChicmozL2TxEffect } from "@chicmoz-pkg/types";

export const getTxEffectData = (data: ChicmozL2TxEffect) => [
  {
    label: "HASH",
    value: data.hash,
  },
  {
    label: "TRANSACTION FEE",
    value: data.transactionFee.toString(),
  },
  //TODO: get actual Block number and time stamp
  { label: "BLOCK NUMBER", value: "-1" },
  { label: "TIMESTAMP", value: "-1" },
];
