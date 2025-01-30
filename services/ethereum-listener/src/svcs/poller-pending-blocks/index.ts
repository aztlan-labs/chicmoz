// TODO
import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { logger } from "../../logger.js";

export const pendingBlocksPoller: MicroserviceBaseSvc = {
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
