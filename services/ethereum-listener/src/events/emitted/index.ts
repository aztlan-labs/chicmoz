import {
  ChicmozL1L2Validator,
  L1L2BlockProposed,
  L1L2ProofVerified,
} from "@chicmoz-pkg/types";
import { logger } from "../../logger.js";
import {
  publishMessage,
  publishMessageSync,
} from "../../svcs/message-bus/index.js";

export const l1Validator = async (validator: ChicmozL1L2Validator) => {
  const objToSend = {
    ...validator,
    stake: validator.stake.toString(),
  };
  await publishMessage("L1_L2_VALIDATOR_EVENT", { validator: objToSend });
};

export const l2BlockProposed = (blockProposed: L1L2BlockProposed) => {
  logger.info(`L2BlockProposed
l2block number: ${blockProposed.l2BlockNumber}
l1block number: ${blockProposed.l1BlockNumber}
archive:        ${blockProposed.archive}
blockTimestamp: ${blockProposed.blockTimestamp}`);
  publishMessageSync("L1_L2_BLOCK_PROPOSED_EVENT", {
    ...blockProposed,
    l2BlockNumber: blockProposed.l2BlockNumber.toString() as unknown as bigint,
    l1BlockNumber: blockProposed.l1BlockNumber.toString() as unknown as bigint,
  });
};

export const l2ProofVerified = (proofVerified: L1L2ProofVerified) => {
  logger.info(`L2ProofVerified
l2block number: ${proofVerified.l2BlockNumber}
proverId:       ${proofVerified.proverId}
l1block number: ${proofVerified.l1BlockNumber}
blockTimestamp: ${proofVerified.blockTimestamp}`);
  publishMessageSync("L1_L2_PROOF_VERIFIED_EVENT", {
    ...proofVerified,
    l2BlockNumber: proofVerified.l2BlockNumber.toString() as unknown as bigint,
    l1BlockNumber: proofVerified.l1BlockNumber.toString() as unknown as bigint,
  });
};
