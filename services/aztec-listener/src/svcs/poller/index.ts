import { NodeInfo, transformNodeInfo } from "@chicmoz-pkg/types";
import {
  AZTEC_GENESIS_CATCHUP,
  AZTEC_LISTEN_FOR_BLOCKS,
  AZTEC_LISTEN_FOR_PENDING_TXS,
  AZTEC_RPC_URL,
} from "../../constants.js";
import {
  getHeight as getLatestProcessedHeight,
  storeHeight,
} from "../database/latestProcessedHeight.controller.js";
import { logger } from "../../logger.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import {
  startPolling as startPollingBlocks,
  stopPolling as stopPollingBlocks,
} from "./block_poller.js";
import {
  startPolling as startPollingPendingTxs,
  stopPolling as stopPollingPendingTxs,
} from "./txs_poller.js";
import { startCatchup } from "./genesis-catchup.js";
import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { onConnectedToAztec } from "../../events/emitted/index.js";

let nodeInfo: NodeInfo;

const getHeights = async () => {
  const latestProcessedHeight = (await getLatestProcessedHeight()) ?? 0;
  const chainHeight = await getLatestHeight();
  return { latestProcessedHeight, chainHeight };
};

export const init = async () => {
  nodeInfo = await initNetworkClient();
  const { latestProcessedHeight, chainHeight } = await getHeights();
  const connectedEvent = {
    nodeInfo: transformNodeInfo(nodeInfo),
    rpcUrl: AZTEC_RPC_URL,
    chainHeight,
    latestProcessedHeight,
  };
  logger.info(`Aztec connected event: ${JSON.stringify(connectedEvent)}`);
  await onConnectedToAztec(connectedEvent);
};

export const startPoller = async () => {
  logger.info(`🤡 POLLER: starting...`);
  const { latestProcessedHeight, chainHeight } = await getHeights();
  if (AZTEC_LISTEN_FOR_PENDING_TXS) startPollingPendingTxs();
  const isOffSync = chainHeight < latestProcessedHeight;
  if (isOffSync) {
    logger.warn(
      `🤡 POLLER: chain height is ${chainHeight} but we've processed up to ${latestProcessedHeight}`
    );
    await storeHeight(0);
  }
  if (AZTEC_GENESIS_CATCHUP) await startCatchup({ from: 1, to: chainHeight });
  const pollFromHeight =
    !isOffSync && latestProcessedHeight
      ? latestProcessedHeight + 1
      : chainHeight;
  if (AZTEC_LISTEN_FOR_BLOCKS)
    startPollingBlocks({ fromHeight: pollFromHeight });
}


export const getNodeInfo = () => nodeInfo;

export const pollerService: MicroserviceBaseSvc = {
  serviceId: "POLLER",
  getConfigStr: () => "TODO conf str!",
  init,
  // TODO: improve health check
  health: () => nodeInfo !== undefined,
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown: async () => {
    stopPollingBlocks();
    stopPollingPendingTxs();
  },
};
