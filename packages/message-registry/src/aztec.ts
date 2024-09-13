import { NodeInfoAlias } from '@chicmoz-pkg/types';

export type NewBlockEvent = {
  nodeInfo: NodeInfoAlias;
  block?: string;
};

export function generateAztecTopicName(networkId: string, topic: keyof AZTEC_MESSAGES): string {
  return `${networkId}_${topic}`;
}

export type AZTEC_MESSAGES = {
  NEW_BLOCK_EVENT: NewBlockEvent
};
