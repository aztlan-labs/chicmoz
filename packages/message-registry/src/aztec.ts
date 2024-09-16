import { NodeInfo } from '@chicmoz-pkg/types';

export type NewBlockEvent = {
  nodeInfo: NodeInfo;
  block?: string;
};

export function generateAztecTopicName(networkId: string, topic: keyof AZTEC_MESSAGES): string {
  return `${networkId}_${topic}`;
}

export type AZTEC_MESSAGES = {
  NEW_BLOCK_EVENT: NewBlockEvent
};
