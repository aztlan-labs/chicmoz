import { logger } from "../logger.js";
import { setup } from "./pxe.js";
import * as scenarios from "./scenarios/index.js";

export async function init() {
  logger.info("Initializing Cannon...");
  await setup();
  return {
    id: "Cannon",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      logger.info("Shutting down Cannon...");
    },
  };
}

export const start = async () => {
  logger.info("Starting Cannon...");
  const scenariosToRun = [
    //scenarios.deploySimpleDefaultAccount,
    //scenarios.deployAndInteractTokenContract,
    //scenarios.deployAndInteractFunctionsVote,
    scenarios.deploySimpleContract,
    //scenarios.deploySimpleLog,
    //scenarios.l1L2PublicMessaging,
    //scenarios.l1L2PrivateMessaging,
  ] as (() => Promise<void>)[];
  for (const fn of scenariosToRun) await fn();
};
