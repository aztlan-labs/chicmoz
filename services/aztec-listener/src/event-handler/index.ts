import {
  NodeInfo,
  chicmozL2PendingTxSchema,
  transformNodeInfo,
} from "@chicmoz-pkg/types";
import { L2Block, Tx } from "@aztec/aztec.js";
import { getNodeInfo } from "../aztec/index.js";
import { logger } from "../logger.js";
import { publishMessage } from "../message-bus/index.js";
import { AZTEC_RPC_URL } from "../constants.js";

export const onBlock = async (block: L2Block) => {
  const height = Number(block.header.globalVariables.blockNumber);
  logger.info(`🦊 publishing block ${height}...`);
  const blockStr = block.toString();
  await publishMessage("NEW_BLOCK_EVENT", {
    block: blockStr,
    blockNumber: height,
    nodeInfo: getNodeInfo(),
  });
};

export const onCatchupBlock = async (block: L2Block) => {
  const blockStr = block.toString();
  await publishMessage("CATCHUP_BLOCK_EVENT", {
    block: blockStr,
    blockNumber: Number(block.header.globalVariables.blockNumber),
    nodeInfo: getNodeInfo(),
  });
};
// TODO: onCatchupRequestFromExplorerApi

// eslint-disable-next-line @typescript-eslint/require-await
export const onPendingTxs = async (txs: Tx[]) => {
  if (!txs[0]) {
    logger.error("🚫 Tx is empty");
    return;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const res = chicmozL2PendingTxSchema.parse({
      ...txs[0].toJSON(),
      hash: txs[0].getTxHash().to0xString()
    });
    logger.info(JSON.stringify(res));
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`🚫 Invalid transaction: ${e}`);
    return;
  }
  //await publishMessage("PENDING_TX_EVENT", {
  //  tx,
  //});
};

export const onConnectedToAztec = async (
  nodeInfo: NodeInfo,
  chainHeight: number,
  latestProcessedHeight: number
) => {
  await publishMessage("CONNECTED_TO_AZTEC_EVENT", {
    nodeInfo: transformNodeInfo(nodeInfo),
    rpcUrl: AZTEC_RPC_URL,
    chainHeight,
    latestProcessedHeight,
  });
};
