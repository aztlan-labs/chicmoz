import { type ChicmozL2Block } from "@chicmoz-pkg/types";
import { getTxEffectTableObj } from "~/components/tx-effects/tx-effects-schema";
import { formatTimeSince } from "~/lib/utils";

export const getBlockDetails = (latestBlock: ChicmozL2Block) => {
  const timestamp = latestBlock.header.globalVariables.timestamp;
  const timeSince = formatTimeSince(timestamp);

  return [
    { label: "Block Number", value: "" + latestBlock.height },
    { label: "Block Hash", value: latestBlock.hash },
    {
      label: "Timestamp",
      value: new Date(timestamp).toLocaleString() + ` (${timeSince})`,
    },
    {
      label: "slotNumber",
      value: "" + latestBlock.header.globalVariables.slotNumber,
    },
    {
      label: "coinbase",
      value: "" + latestBlock.header.globalVariables.coinbase,
    },
    // TODO: stats on logs
    {
      label: "number of transactions",
      value: "" + latestBlock.body.txEffects.length,
    },
    {
      label: "feeRecipient",
      value: "" + latestBlock.header.globalVariables.feeRecipient,
    },
    {
      label: "totalFees",
      value: "" + latestBlock.header.totalFees,
    },
    {
      label: "feePerDaGas",
      value: "" + latestBlock.header.globalVariables.gasFees.feePerDaGas,
    },
    {
      label: "feePerL2Gas",
      value: "" + latestBlock.header.globalVariables.gasFees.feePerL2Gas,
    },
  ];
};

export const getTxEffects = (latestBlock: ChicmozL2Block) => {
  return latestBlock.body.txEffects.map((tx) =>
    getTxEffectTableObj(tx, latestBlock)
  );
};
