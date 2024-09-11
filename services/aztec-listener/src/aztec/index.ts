import { NodeInfo } from "@aztec/aztec.js";
import { logger } from "../logger.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import { CATCHUP_ENABLED, LISTEN_FOR_BLOCKS } from "../constants.js";
import { startPolling, stopPolling } from "./poller.js";

export const init = async () => {
  // TODO: why unsafe?
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const res: NodeInfo = await initNetworkClient();
  logger.info(`AZTEC: initialized: ${JSON.stringify(res)}`);
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
