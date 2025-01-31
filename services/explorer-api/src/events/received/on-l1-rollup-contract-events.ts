import { EventHandler } from "@chicmoz-pkg/message-bus";
import {
  generateL1TopicName,
  getConsumerGroupId,
} from "@chicmoz-pkg/message-registry";
import {
  L1L2BlockProposed,
  L1L2ProofVerified,
  getL1NetworkId,
  l1L2BlockProposedSchema,
  l1L2ProofVerifiedSchema,
} from "@chicmoz-pkg/types";
import { SERVICE_NAME } from "../../constants.js";
import { L2_NETWORK_ID } from "../../environment.js";

// eslint-disable-next-line @typescript-eslint/require-await
const onProp = async (event: L1L2BlockProposed) => {
  l1L2BlockProposedSchema.parse(event);
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

// eslint-disable-next-line @typescript-eslint/require-await
const onVerf = async (event: L1L2ProofVerified) => {
  l1L2ProofVerifiedSchema.parse(event);
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
