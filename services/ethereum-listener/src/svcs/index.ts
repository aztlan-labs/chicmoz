import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { messageBusService } from "./message-bus/index.js";
import { ethereumNetworkClientService } from "./network-client/index.js";
import { pendingContractChangesPoller } from "./poller-contract-changes/index.js";

export const services: MicroserviceBaseSvc[] = [
  messageBusService,
  ethereumNetworkClientService,
  pendingContractChangesPoller,
];
