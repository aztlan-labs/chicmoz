import { L2Payload, L2Topic } from "./aztec.js";
import { L1Payload, L1Topic } from "./ethereum.js";

export * from "./aztec.js";
export * from "./ethereum.js";
export * from "./metric.js"; // TODO (legacy)
export * from "./subscription.js"; // TODO (legacy)

export type ChicmozMessageBusTopic = L2Topic | L1Topic;
export type ChicmozMessageBusPayload = L2Payload | L1Payload;
