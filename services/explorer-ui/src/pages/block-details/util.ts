import {
  type ChicmozL2Block,
  type ChicmozL2BlockLight,
} from "@chicmoz-pkg/types";
import { type DetailItem } from "~/components/info-display/key-value-display";
import { getTxEffectTableObj } from "~/components/tx-effects/tx-effects-schema";
import { formatTimeSince } from "~/lib/utils";
import { API_URL, aztecExplorer } from "~/service/constants";

export const getBlockDetails = (
  latestBlock: ChicmozL2BlockLight
): DetailItem[] => {
  const l2BlockTimestamp = latestBlock.header.globalVariables.timestamp;
  const l2BlockTimeSince = formatTimeSince(l2BlockTimestamp);

  let proposedTimeSince: string | undefined = undefined;
  let proposedOnL1Timestamp: number | undefined = undefined;
  if (latestBlock?.proposedOnL1?.l1BlockTimestamp) {
    proposedOnL1Timestamp =
      (latestBlock?.proposedOnL1?.l1BlockTimestamp as number) * 1000;
    proposedTimeSince = formatTimeSince(proposedOnL1Timestamp);
  }

  let proofVerifiedTimeSince: string | undefined = undefined;
  let proofVerifiedOnL1Timestamp: number | undefined = undefined;
  if (latestBlock?.proofVerifiedOnL1?.l1BlockTimestamp) {
    proofVerifiedOnL1Timestamp =
      (latestBlock?.proofVerifiedOnL1?.l1BlockTimestamp as number) * 1000;
    proofVerifiedTimeSince = formatTimeSince(proofVerifiedOnL1Timestamp);
  }
  return [
    { label: "Block Number", value: "" + latestBlock.height },
    { label: "Block Hash", value: latestBlock.hash },
    {
      label: "Timestamp",
      value: `${new Date(
        l2BlockTimestamp
      ).toLocaleString()} (${l2BlockTimeSince})`,
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
      label: "Number of Transactions",
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
      label: "totalManaUsed",
      value: "" + latestBlock.header.totalManaUsed,
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
      label: "Proposed on L1",
      value: proposedOnL1Timestamp
        ? `${new Date(
            proposedOnL1Timestamp
          ).toLocaleString()} (${proposedTimeSince})`
        : "Not yet proposed",
    },
    {
      label: "Proof Verified on L1",
      value: proofVerifiedOnL1Timestamp
        ? `${new Date(
            proofVerifiedOnL1Timestamp
          ).toLocaleString()} (${proofVerifiedTimeSince})`
        : "Not yet verified",
    },
    {
      label: "Raw Data",
      value: "View raw data",
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
