import { EventHandler } from "@chicmoz-pkg/message-bus";
import {
  generateL1TopicName,
  getConsumerGroupId,
} from "@chicmoz-pkg/message-registry";
import {
  ChicmozL1GenericContractEvent,
  ChicmozL1L2BlockProposed,
  ChicmozL1L2ProofVerified,
  getL1NetworkId,
  chicmozL1L2BlockProposedSchema,
  chicmozL1L2ProofVerifiedSchema,
} from "@chicmoz-pkg/types";
import { SERVICE_NAME } from "../../constants.js";
import { L2_NETWORK_ID } from "../../environment.js";
import { logger } from "../../logger.js";
import { store } from "../../svcs/database/controllers/l1/generic-contract-event/store.js";
import {
  addL1L2BlockProposed,
  addL1L2ProofVerified,
} from "../../svcs/database/controllers/l2block/add_l1_data.js";

const onProp = async (event: ChicmozL1L2BlockProposed) => {
  logger.info(
    `🎓 L1L2BlockProposed l2BlockNumber: ${event.l2BlockNumber} l1BlockNumber: ${event.l1BlockNumber}`
  );
  const parsed = chicmozL1L2BlockProposedSchema.parse(event);
  await addL1L2BlockProposed(parsed);
};

export const l1L2BlockProposedHandler: EventHandler = {
  groupId: getConsumerGroupId({
    serviceName: SERVICE_NAME,
    networkId: L2_NETWORK_ID,
    handlerName: "l1L2BlockProposedHandler",
  }),
  topic: generateL1TopicName(
    L2_NETWORK_ID,
    getL1NetworkId(L2_NETWORK_ID),
    "L1_L2_BLOCK_PROPOSED_EVENT"
  ),
  cb: onProp as (arg0: unknown) => Promise<void>,
};

const onVerf = async (event: ChicmozL1L2ProofVerified) => {
  logger.info(
    `🎩 L1L2ProofVerified l2BlockNumber: ${event.l2BlockNumber} l1BlockNumber: ${event.l1BlockNumber}`
  );
  const parsed = chicmozL1L2ProofVerifiedSchema.parse(event);
  await addL1L2ProofVerified(parsed);
};

export const l1L2ProofVerifiedHandler: EventHandler = {
  groupId: getConsumerGroupId({
    serviceName: SERVICE_NAME,
    networkId: L2_NETWORK_ID,
    handlerName: "l1L2ProofVerifiedHandler",
  }),
  topic: generateL1TopicName(
    L2_NETWORK_ID,
    getL1NetworkId(L2_NETWORK_ID),
    "L1_L2_PROOF_VERIFIED_EVENT"
  ),
  cb: onVerf as (arg0: unknown) => Promise<void>,
};

const onGeneric = async (event: ChicmozL1GenericContractEvent) => {
  logger.info(`🍔 L1GenericContractEvent | ${event.eventName}`);
  await store(event);
};

export const l1GenericContractEventHandler: EventHandler = {
  groupId: getConsumerGroupId({
    serviceName: SERVICE_NAME,
    networkId: L2_NETWORK_ID,
    handlerName: "l1GenericContractEventHandler",
  }),
  topic: generateL1TopicName(
    L2_NETWORK_ID,
    getL1NetworkId(L2_NETWORK_ID),
    "L1_GENERIC_CONTRACT_EVENT"
  ),
  cb: onGeneric as (arg0: unknown) => Promise<void>,
};
