import { IBackOffOptions, backOff } from "exponential-backoff";
import { NodeInfo } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import {
  CATCHUP_ENABLED,
  LISTEN_FOR_BLOCKS,
  DISABLE_AZTEC,
} from "../constants.js";
import { startPolling, stopPolling } from "./poller.js";

const backOffOptions: Partial<IBackOffOptions> = {
  numOfAttempts: 10,
  maxDelay: 10000,
  retry: (e, attemptNumber: number) => {
    logger.warn(e);
    logger.info(
      `🤡 We'll allow some errors during start-up, retrying attempt ${attemptNumber}...`
    );
    return true;
  },
};

let nodeInfo: NodeInfo;

export const init = async () => {
  if (DISABLE_AZTEC) {
    logger.info(
      "AZTEC_DISABLED is set to true, skipping initialization entirely..."
    );
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return { shutdownAztec: () => {} };
  }
  // TODO: why unsafe?
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  nodeInfo = await backOff(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await initNetworkClient();
  }, backOffOptions);
  logger.info(`AZTEC: initialized: ${JSON.stringify(nodeInfo)}`);
  const currentHeight = await getLatestHeight();
  if (CATCHUP_ENABLED) logger.info("TODO: need to fix catchup-logic");
  // startCatchup({ untilHeight: currentHeight });
  // Should it be blocking?

  if (LISTEN_FOR_BLOCKS) await startPolling({ fromHeight: currentHeight });

  return {
    shutdownAztec: () => {
      stopPolling();
    },
  };
};

export const getNodeInfo = () => nodeInfo;
