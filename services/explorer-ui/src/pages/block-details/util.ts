import {
  type ChicmozL2Block,
  type ChicmozL2BlockLight,
} from "@chicmoz-pkg/types";
import { getTxEffectTableObj } from "~/components/tx-effects/tx-effects-schema";
import { formatTimeSince } from "~/lib/utils";
import { API_URL, aztecExplorer } from "~/service/constants";

export const getBlockDetails = (latestBlock: ChicmozL2BlockLight) => {
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
    {
      label: "number of transactions",
      value: "" + latestBlock.body.txEffects.length,
    },
    {
      label: "feeRecipient",
      value: "" + latestBlock.header.globalVariables.feeRecipient,
    },
    {
      label: "totalFees (FPA)",
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
    {
      label: "Raw Data",
      value: `/${aztecExplorer.getL2BlockByHash}${latestBlock.height}`,
      extLink: `${API_URL}/${aztecExplorer.getL2BlockByHash}${latestBlock.height}`,
    },
  ];
};

export const getTxEffects = (
  txEffects?: ChicmozL2Block["body"]["txEffects"],
  latestBlock?: ChicmozL2BlockLight
) => {
  if (!txEffects) return undefined;
  if (!latestBlock) return undefined;
  return txEffects.map((tx) => getTxEffectTableObj(tx, latestBlock));
};
