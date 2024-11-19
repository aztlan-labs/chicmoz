import { logger } from "../logger.js";
import { setup } from "./pxe.js";
import { run as deployBroadcastFunctionsVote } from "./scenarios/deploy-broadcast-functions-vote.js";
import { run as deploySimpleDefaultAccount } from "./scenarios/deploy-simple-default-account.js";

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
    deploySimpleDefaultAccount,
  ] as (() => Promise<void>)[];
  for (const fn of scenarios) await fn();
};
