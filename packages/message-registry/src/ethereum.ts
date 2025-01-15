import {
  type ChicmozL1L2Validator,
  type EthAddress,
  type L1NetworkId,
  type L2NetworkId,
} from "@chicmoz-pkg/types";

export type ConnectedToL1Event = {
  something: string;
};

export type NewL1Event = {
  contractAddress: EthAddress;
  l1BlockNumber: number;
  data: unknown;
};

export type L1L2ValidatorEvent = {
  validator: Omit<ChicmozL1L2Validator, "stake"> & { stake: string };
};

export type L1Topic = `${L2NetworkId}_${L1NetworkId}__${keyof L1_MESSAGES}`;

export function generateL1TopicName(
  l2NetworkId: L2NetworkId,
  l1NetworkId: L1NetworkId,
  topic: keyof L1_MESSAGES
): L1Topic {
  return `${l2NetworkId}_${l1NetworkId}__${topic}`;
}

export type L1_MESSAGES = {
  CONNECTED_TO_L1_EVENT: ConnectedToL1Event; // TODO: rename to L1
  NEW_L1_EVENT: NewL1Event;
  L1_L2_VALIDATOR_EVENT: L1L2ValidatorEvent;
};

export type L1Payload = L1_MESSAGES[keyof L1_MESSAGES];
