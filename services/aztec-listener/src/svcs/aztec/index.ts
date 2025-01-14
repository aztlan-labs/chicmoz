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

export const init = async () => {
  nodeInfo = await initNetworkClient();

  const latestProcessedHeight = (await getLatestProcessedHeight()) ?? 0;
  const chainHeight = await getLatestHeight();
  await onConnectedToAztec({
    nodeInfo: transformNodeInfo(nodeInfo),
    rpcUrl: AZTEC_RPC_URL,
    chainHeight,
    latestProcessedHeight,
  });
  if (AZTEC_LISTEN_FOR_PENDING_TXS) startPollingPendingTxs();
  const isOffSync = chainHeight < latestProcessedHeight;
  if (isOffSync) {
    logger.warn(
      `🤡 AZTEC: chain height is ${chainHeight} but we've processed up to ${latestProcessedHeight}`
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

export const aztecService: MicroserviceBaseSvc = {
  serviceId: "AZTEC",
  init,
  // TODO: improve health check
  health: () => nodeInfo !== undefined,
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown: async () => {
    stopPollingBlocks();
    stopPollingPendingTxs();
  },
};
