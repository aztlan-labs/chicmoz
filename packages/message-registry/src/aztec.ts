import { NodeInfo } from '@chicmoz-pkg/types';

export type ConnectedToAztecEvent = {
  nodeInfo: NodeInfo;
  chainHeight: number;
  latestProcessedHeight: number;
};

export type NewBlockEvent = {
  blockNumber: number;
  block?: string;
};

export type CatchupBlockEvent = NewBlockEvent;

export function generateAztecTopicName(networkId: string, topic: keyof AZTEC_MESSAGES): string {
  return `${networkId}_${topic}`;
}

export type AZTEC_MESSAGES = {
  CONNECTED_TO_AZTEC: ConnectedToAztecEvent
  NEW_BLOCK_EVENT: NewBlockEvent
  CATCHUP_BLOCK_EVENT: CatchupBlockEvent
};
