import { L2Block } from "@aztec/aztec.js";

// TODO: adjust based on Aztec data
export type NewBlockEvent = {
  blockHash: string;
  nbrOfTransactions: number;
  index: number;
};

type NEW_BLOCK_EVENT = {
  block?: L2Block;
};

export function generateAztecTopicName(networkId: string, topic: keyof AZTEC_MESSAGES): string {
  // TODO: this function should be moved and shared with future chains like Mina
  return `${networkId}_${topic}`;
}

export type AZTEC_MESSAGES = {
  NEW_BLOCK_EVENT: NEW_BLOCK_EVENT;
};
