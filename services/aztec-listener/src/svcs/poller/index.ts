import { NodeInfo } from "@aztec/aztec.js";
import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { NODE_ENV, NodeEnv } from "@chicmoz-pkg/types";
import {
  AZTEC_GENESIS_CATCHUP,
  AZTEC_LISTEN_FOR_BLOCKS,
  AZTEC_LISTEN_FOR_PENDING_TXS,
  getConfigStr,
} from "../../environment.js";
import { onL2RpcNodeError } from "../../events/emitted/index.js";
import { logger } from "../../logger.js";
import {
  getHeight as getLatestProcessedHeight,
  storeHeight,
} from "../database/latestProcessedHeight.controller.js";
import * as blockPoller from "./block_poller.js";
import * as chainInfoPoller from "./chain-info-poller.js";
import { startCatchup } from "./genesis-catchup.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import * as pendingTxsPoller from "./txs_poller.js";

let nodeInfo: NodeInfo;

const getHeights = async () => {
  const latestProcessedHeight = (await getLatestProcessedHeight()) ?? 0;
  const chainHeight = await getLatestHeight();
  return { latestProcessedHeight, chainHeight };
};

export const init = async () => {
  if (NODE_ENV === NodeEnv.DEV) {
    onL2RpcNodeError({
      name: "Mocked Node Error",
      message: "Lorem ipsum dolor sit amet",
      cause: "UnknownCause",
      stack: new Error().stack?.toString() ?? "UnknownStack",
      data: {},
    });
  }
  const initResult = await initNetworkClient();
  logger.info(`Aztec chain info: ${JSON.stringify(initResult.chainInfo)}`);
  logger.info(`Aztec sequencer info: ${JSON.stringify(initResult.sequencer)}`);
};

export const startPoller = async () => {
  logger.info(`🤡 POLLER: starting...`);
  const { latestProcessedHeight, chainHeight } = await getHeights();
  if (AZTEC_LISTEN_FOR_PENDING_TXS) pendingTxsPoller.startPolling();
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
    blockPoller.startPolling({ fromHeight: pollFromHeight });
  chainInfoPoller.startPolling();
};

export const getNodeInfo = () => nodeInfo;

export const pollerService: MicroserviceBaseSvc = {
  serviceId: "POLLER",
  getConfigStr,
  init,
  // TODO: improve health check
  health: () => nodeInfo !== undefined,
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown: async () => {
    pendingTxsPoller.stopPolling();
    blockPoller.stopPolling();
    chainInfoPoller.stopPolling();
  },
};
