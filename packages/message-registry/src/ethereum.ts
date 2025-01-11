import { ChicmozL1L2Validator, EthAddress } from "@chicmoz-pkg/types";

export type ConnectedToEthereumEvent = {
  something: string;
};

export type NewL1Event = {
  contractAddress: EthAddress;
  l1BlockNumber: number;
  data: unknown;
};

export type L1L2ValidatorEvent = {
  validator: ChicmozL1L2Validator;
};

export function generateEthereumTopicName(
  networkId: string,
  topic: keyof ETHEREUM_MESSAGES
): string {
  return `${networkId}_${topic}`;
}

export type ETHEREUM_MESSAGES = {
  CONNECTED_TO_ETHEREUM_EVENT: ConnectedToEthereumEvent;
  NEW_L1_EVENT: NewL1Event;
  L1_L2_VALIDATOR_EVENT: L1L2ValidatorEvent;
};
