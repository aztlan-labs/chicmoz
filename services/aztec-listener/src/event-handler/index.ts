import { NodeInfo } from "@chicmoz-pkg/types";
import { L2Block } from "@aztec/aztec.js";
import { getNodeInfo } from "../aztec/index.js";
import { logger } from "../logger.js";
import { publishMessage } from "../message-bus/index.js";

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

export const onConnectedToAztec = async (
  nodeInfo: NodeInfo,
  chainHeight: number,
  latestProcessedHeight: number
) => {
  await publishMessage("CONNECTED_TO_AZTEC", {
    nodeInfo,
    chainHeight,
    latestProcessedHeight,
  });
};
