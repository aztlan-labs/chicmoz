import { EthAddress } from "@chicmoz-pkg/types";

export type ConnectedToEthereumEvent = {
  something: string;
};

export type NewL1Event = {
  contractAddress: EthAddress;
  l1BlockNumber: number;
  data: unknown;
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
};
