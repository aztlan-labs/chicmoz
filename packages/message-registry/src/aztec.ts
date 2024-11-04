import { ChicmozL2TxEffect, StringifiedNodeInfo } from "@chicmoz-pkg/types";

export type ConnectedToAztecEvent = {
  nodeInfo: StringifiedNodeInfo;
  rpcUrl: string;
  chainHeight: number;
  latestProcessedHeight: number;
};

export type NewBlockEvent = {
  blockNumber: number;
  block?: string;
};

export type PendingTxEvent = {
  tx: ChicmozL2TxEffect;
};

export type CatchupBlockEvent = NewBlockEvent;

export function generateAztecTopicName(
  networkId: string,
  topic: keyof AZTEC_MESSAGES
): string {
  return `${networkId}_${topic}`;
}

export type AZTEC_MESSAGES = {
  CONNECTED_TO_AZTEC_EVENT: ConnectedToAztecEvent;
  NEW_BLOCK_EVENT: NewBlockEvent;
  CATCHUP_BLOCK_EVENT: CatchupBlockEvent;
  PENDING_TX_EVENT: PendingTxEvent;
};
