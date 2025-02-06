// TODO
import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { logger } from "../../logger.js";
import { queryStakingStateAndEmitUpdates } from "../network-client/client.js";

let started = false;

export const startPolling = async () => {
  // TODO: poll logic with backoff etc...
  if (started) return;
  started = true;
  await queryStakingStateAndEmitUpdates();
};

export const pendingContractChangesPoller: MicroserviceBaseSvc = {
  svcId: "pendingBlocksPoller",
  // eslint-disable-next-line @typescript-eslint/require-await
  init: async () => {
    logger.info("pendingBlocksPoller init");
  },
  health: () => true,
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown: async () => {
    logger.info("pendingBlocksPoller shutdown");
  },
  getConfigStr: () => `NONE`,
};
