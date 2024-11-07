import { logger } from "../logger.js";
import { setup } from "./pxe.js";
import { run as deployBroadcastFunctionsVote } from "./scenarios/deploy-broadcast-functions-vote.js";

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
  const scenarios = [
    deployBroadcastFunctionsVote,
  ] as (() => Promise<void>)[];
  for (const fn of scenarios) {
    logger.info(`Running scenario...`);
    await fn();
  }
};
