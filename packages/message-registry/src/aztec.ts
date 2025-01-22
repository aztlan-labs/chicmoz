import {
  ChicmozChainInfo,
  ChicmozL2PendingTx,
  ChicmozL2RpcNodeInfo,
  ChicmozL2RpcNodeError,
  ChicmozL2SequencerInfo,
  L2NetworkId,
  StringifiedNodeInfo,
} from "@chicmoz-pkg/types";

export type NewBlockEvent = {
  blockNumber: number;
  block?: string;
};

export type PendingTxsEvent = {
  txs: ChicmozL2PendingTx[];
};

export type CatchupBlockEvent = NewBlockEvent;

export type ChicmozNodeInfoEvent = {
  nodeInfo: ChicmozL2RpcNodeInfo;
};

export type ChicmozNodeErrorEvent = {
  nodeError: ChicmozL2RpcNodeError;
};

export type ChicmozSequencerInfoEvent = {
  sequencerInfo: ChicmozL2SequencerInfo;
};

export type ChicmozChainInfoEvent = {
  chainInfo: ChicmozChainInfo;
};

export function generateL2TopicName(
  networkId: L2NetworkId,
  topic: keyof L2_MESSAGES
): L2Topic {
  return `${networkId}__${topic}`;
}

export type L2_MESSAGES = {
  NEW_BLOCK_EVENT: NewBlockEvent;
  CATCHUP_BLOCK_EVENT: CatchupBlockEvent;
  PENDING_TXS_EVENT: PendingTxsEvent;
  CONNECTED_TO_L2_EVENT: ConnectedToL2Event;
  RPC_NODE_INFO_EVENT: ChicmozNodeInfoEvent;
  RPC_NODE_ERROR_EVENT: ChicmozNodeErrorEvent;
  SEQUENCER_INFO_EVENT: ChicmozSequencerInfoEvent;
  CHAIN_INFO_EVENT: ChicmozChainInfoEvent;
};

export type L2Topic = `${L2NetworkId}__${keyof L2_MESSAGES}`;
export type L2Payload = L2_MESSAGES[keyof L2_MESSAGES];

// TODO: remove below legacy code
export type ConnectedToL2Event = {
  nodeInfo: StringifiedNodeInfo;
  rpcUrl: string;
  chainHeight: number;
  latestProcessedHeight: number;
};
