import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { messageBusService } from "./message-bus/index.js";
import { ethereumNetworkClient } from "./network-client/index.js";
import { pendingBlocksPoller } from "./poller-pending-blocks/index.js";

export const services: MicroserviceBaseSvc[] = [
  messageBusService,
  pendingBlocksPoller,
  ethereumNetworkClient,
];
