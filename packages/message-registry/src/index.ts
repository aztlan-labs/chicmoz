import { AZTEC_MESSAGES } from "./aztec.js";
import { ETHEREUM_MESSAGES } from "./ethereum.js";

export * from "./aztec.js";
export * from "./ethereum.js";
export * from "./metric.js";
export * from "./subscription.js";

export const generateTopicName = (
  networkId: string,
  topic: keyof AZTEC_MESSAGES | keyof ETHEREUM_MESSAGES
): string => {
  return `${networkId}_${topic}`;
};
