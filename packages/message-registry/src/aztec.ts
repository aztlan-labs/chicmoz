import {
  L2NetworkId,
  ChicmozL2PendingTx,
  StringifiedNodeInfo,
} from "@chicmoz-pkg/types";

export type ConnectedToL2Event = {
  nodeInfo: StringifiedNodeInfo;
  rpcUrl: string;
  chainHeight: number;
  latestProcessedHeight: number;
};

export type NewBlockEvent = {
  blockNumber: number;
  block?: string;
};

export type PendingTxsEvent = {
  txs: ChicmozL2PendingTx[];
};

export type CatchupBlockEvent = NewBlockEvent;

export type L2Topic = `${L2NetworkId}__${keyof L2_MESSAGES}`;

export function generateL2TopicName(
  networkId: L2NetworkId,
  topic: keyof L2_MESSAGES
): L2Topic {
  return `${networkId}__${topic}`;
}

export type L2_MESSAGES = {
  CONNECTED_TO_L2_EVENT: ConnectedToL2Event;
  NEW_BLOCK_EVENT: NewBlockEvent;
  CATCHUP_BLOCK_EVENT: CatchupBlockEvent;
  PENDING_TXS_EVENT: PendingTxsEvent;
};

export type L2Payload = L2_MESSAGES[keyof L2_MESSAGES];
