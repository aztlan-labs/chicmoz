export type NewBlockEvent = {
  blockHash: string;
  nbrOfTransactions: number;
  index: number;
};

type NEW_BLOCK_EVENT = {
  block?: string;
};

export function generateAztecTopicName(networkId: string, topic: keyof AZTEC_MESSAGES): string {
  return `${networkId}_${topic}`;
}

export type AZTEC_MESSAGES = {
  NEW_BLOCK_EVENT: NEW_BLOCK_EVENT;
};
