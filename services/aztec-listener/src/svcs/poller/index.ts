import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import {
  NodeInfo,
  getChicmozChainInfo,
  getSequencerInfo,
} from "@chicmoz-pkg/types";
import {
  AZTEC_GENESIS_CATCHUP,
  AZTEC_LISTEN_FOR_BLOCKS,
  AZTEC_LISTEN_FOR_PENDING_TXS,
  L2_NETWORK_ID,
  getConfigStr,
} from "../../environment.js";
import { onChainInfo, onL2SequencerInfo } from "../../events/emitted/index.js";
import { logger } from "../../logger.js";
import {
  getHeight as getLatestProcessedHeight,
  storeHeight,
} from "../database/latestProcessedHeight.controller.js";
import {
  startPolling as startPollingBlocks,
  stopPolling as stopPollingBlocks,
} from "./block_poller.js";
import { startCatchup } from "./genesis-catchup.js";
import {
  getLatestHeight,
  init as initNetworkClient,
} from "./network-client.js";
import {
  startPolling as startPollingPendingTxs,
  stopPolling as stopPollingPendingTxs,
} from "./txs_poller.js";

let nodeInfo: NodeInfo;

const getHeights = async () => {
  const latestProcessedHeight = (await getLatestProcessedHeight()) ?? 0;
  const chainHeight = await getLatestHeight();
  return { latestProcessedHeight, chainHeight };
};

export const init = async () => {
  const initResult = await initNetworkClient();
  //const { latestProcessedHeight, chainHeight } = await getHeights();
  const chainInfo = getChicmozChainInfo(L2_NETWORK_ID, initResult.nodeInfo);
  logger.info(`Aztec chain info: ${JSON.stringify(chainInfo)}`);
  await onChainInfo(chainInfo);
  const l2Sequencer = getSequencerInfo(
    L2_NETWORK_ID,
    initResult.rpcUrl,
    initResult.nodeInfo
  );
  logger.info(`Aztec sequencer info: ${JSON.stringify(l2Sequencer)}`);
  await onL2SequencerInfo(l2Sequencer);
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
    stopPollingBlocks();
    stopPollingPendingTxs();
  },
};
