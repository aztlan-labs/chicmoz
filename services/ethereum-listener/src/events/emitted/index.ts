import {
  ChicmozL1GenericContractEvent,
  ChicmozL1L2Validator,
  L1L2BlockProposed,
  L1L2ProofVerified,
  jsonStringify,
} from "@chicmoz-pkg/types";
import { logger } from "../../logger.js";
import { publishMessage } from "../../svcs/message-bus/index.js";

export const l1Validator = async (validator: ChicmozL1L2Validator) => {
  const objToSend = {
    ...validator,
    stake: validator.stake.toString(),
  };
  await publishMessage("L1_L2_VALIDATOR_EVENT", { validator: objToSend });
};

export const l2BlockProposed = async (blockProposed: L1L2BlockProposed) => {
  // TODO: add finalization status
  await publishMessage("L1_L2_BLOCK_PROPOSED_EVENT", {
    ...blockProposed,
    l2BlockNumber: blockProposed.l2BlockNumber.toString() as unknown as bigint,
    l1BlockNumber: blockProposed.l1BlockNumber.toString() as unknown as bigint,
  });
};

export const l2ProofVerified = async (proofVerified: L1L2ProofVerified) => {
  // TODO: add finalization status
  await publishMessage("L1_L2_PROOF_VERIFIED_EVENT", {
    ...proofVerified,
    l2BlockNumber: proofVerified.l2BlockNumber.toString() as unknown as bigint,
    l1BlockNumber: proofVerified.l1BlockNumber.toString() as unknown as bigint,
  });
};

export const genericContractEvent = async (
  genericContractEvent: ChicmozL1GenericContractEvent
) => {
  logger.info("");
  logger.info(jsonStringify(genericContractEvent));
  await publishMessage("L1_GENERIC_CONTRACT_EVENT", genericContractEvent);
};
