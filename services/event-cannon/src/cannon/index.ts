import { logger } from "../logger.js";
import { setup } from "./pxe.js";
import { run as deployAndInteractFunctionsVote } from "./scenarios/deploy-and-interact-vote-contract.js";
import { run as deploySimpleDefaultAccount } from "./scenarios/deploy-simple-default-account.js";
import { run as deployAndInteractTokenContract } from "./scenarios/deploy-and-interact-token-contract.js";
import { run as deploySimpleLog } from "./scenarios/deploy-and-run-simple-log.js";

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
    deploySimpleDefaultAccount,
    deployAndInteractTokenContract,
    deployAndInteractFunctionsVote,
    deploySimpleLog,
  ] as (() => Promise<void>)[];
  for (const fn of scenarios) await fn();
};
