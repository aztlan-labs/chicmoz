import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { logger } from "../../logger.js";
import { getFinalizedContractEvents } from "../../network-client/contracts/index.js";

let started = false;
let timoutId: NodeJS.Timeout | undefined;

// eslint-disable-next-line @typescript-eslint/require-await
const init = async () => {
  if (started) return;
  started = true;
  timoutId = setInterval(() => {
    getFinalizedContractEvents().catch((e) => {
      logger.error(`🐻 error in recursive polling: ${(e as Error).stack}`);
    });
  }, 5000);
  //await queryStakingStateAndEmitUpdates();
};

// eslint-disable-next-line @typescript-eslint/require-await
const shutdown = async () => {
  if (timoutId) {
    clearInterval(timoutId);
    timoutId = undefined;
  }
};

export const finalizedEventsPoller: MicroserviceBaseSvc = {
  svcId: "finalizedEventsPoller",
  init,
  shutdown,
  health: () => true,
  getConfigStr: () => `N/A`, // TODO: add config
};
