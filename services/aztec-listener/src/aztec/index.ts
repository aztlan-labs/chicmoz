import { IBackOffOptions, backOff } from "exponential-backoff";
import { NodeInfo } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import {
  AZTEC_GENESIS_CATCHUP,
  AZTEC_LISTEN_FOR_BLOCKS
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
  // TODO: why unsafe?
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  nodeInfo = await backOff(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await initNetworkClient();
  }, backOffOptions);
  logger.info(`AZTEC: initialized: ${JSON.stringify(nodeInfo)}`);
  const currentHeight = await getLatestHeight();
  if (AZTEC_GENESIS_CATCHUP) logger.info("TODO: need to fix catchup-logic");
  // startCatchup({ untilHeight: currentHeight });

  if (AZTEC_LISTEN_FOR_BLOCKS) startPolling({ fromHeight: currentHeight });

  return {
    shutdownAztec: () => {
      stopPolling();
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const getNodeInfo = () => nodeInfo;
