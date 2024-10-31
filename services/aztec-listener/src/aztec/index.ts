import { NodeInfo } from "@chicmoz-pkg/types";
import {
  AZTEC_GENESIS_CATCHUP,
  AZTEC_LISTEN_FOR_BLOCKS,
} from "../constants.js";
import {
  getHeight as getLatestProcessedHeight,
  storeHeight,
} from "../database/latestProcessedHeight.controller.js";
import { logger } from "../logger.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import { startPolling, stopPolling } from "./poller.js";
import { startCatchup } from "./genesis-catchup.js";
import { onConnectedToAztec } from "../event-handler/index.js";

let nodeInfo: NodeInfo;

export const init = async () => {
  nodeInfo = await initNetworkClient();
  logger.info(`AZTEC: initialized: ${JSON.stringify(nodeInfo)}`);

  const latestProcessedHeight = (await getLatestProcessedHeight()) ?? 0;
  const chainHeight = await getLatestHeight();
  await onConnectedToAztec(nodeInfo, chainHeight, latestProcessedHeight);
  const isOffSync = chainHeight < latestProcessedHeight;
  if (isOffSync) {
    logger.warn(
      `🤡 AZTEC: chain height is ${chainHeight} but we've processed up to ${latestProcessedHeight}`
    );
    await storeHeight(0);
  }
  const pollFromHeight =
    !isOffSync && latestProcessedHeight
      ? latestProcessedHeight + 1
      : chainHeight;
  if (AZTEC_GENESIS_CATCHUP)
    await startCatchup({ from: 1, to: pollFromHeight });
  if (AZTEC_LISTEN_FOR_BLOCKS) startPolling({ fromHeight: pollFromHeight });

  return {
    id: "AZTEC",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      stopPolling();
    },
  };
};

export const getNodeInfo = () => nodeInfo;
