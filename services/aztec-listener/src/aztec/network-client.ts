import { createAztecNodeClient, AztecNode, NodeInfo } from "@aztec/aztec.js";
import { AZTEC_RPC_URL, NODE_ENV } from "../constants.js";
import { logger } from "../logger.js";

let aztecNode: AztecNode;

const node = () => {
  if (!aztecNode) throw new Error("Node not initialized");
  return aztecNode;
};

export const logFetchFailedCause = (e: Error) => {
  if (e.cause) logger.warn(`Aztec failed to fetch: ${JSON.stringify(e.cause)}`);
  throw e;
};

export const init = async () => {
  logger.info(`Initializing Aztec node client with ${AZTEC_RPC_URL}`);
  aztecNode = createAztecNodeClient(AZTEC_RPC_URL);
  return getNodeInfo().catch(logFetchFailedCause);
};

export const getNodeInfo = async (): Promise<NodeInfo> => {
  const n = node();
  const [
    nodeVersion,
    protocolVersion,
    chainId,
    enr,
    contractAddresses,
    protocolContractAddresses,
  ] = await Promise.all([
    n.getNodeVersion().catch(logFetchFailedCause),
    n.getVersion().catch(logFetchFailedCause),
    n.getChainId().catch(logFetchFailedCause),
    n.getEncodedEnr().catch(logFetchFailedCause),
    n.getL1ContractAddresses().catch(logFetchFailedCause),
    n.getProtocolContractAddresses().catch(logFetchFailedCause),
  ]);

  const nodeInfo: NodeInfo = {
    nodeVersion,
    l1ChainId: chainId,
    protocolVersion,
    enr,
    l1ContractAddresses: contractAddresses,
    protocolContractAddresses: protocolContractAddresses,
  };

  return nodeInfo;
};

export const getBlock = async (height: number) =>
  node().getBlock(height).catch(logFetchFailedCause);

export const getBlocks = async (fromHeight: number, toHeight: number) => {
  const blocks = [];
  for (let i = fromHeight; i < toHeight; i++) {
    if (NODE_ENV === "development")
      await new Promise((r) => setTimeout(r, 500));
    const block = await node().getBlock(i).catch(logFetchFailedCause);
    blocks.push(block);
  }
  return blocks;
};

export const getLatestHeight = async () => {
  const [bn, provenBn] = await Promise.all([
    node().getBlockNumber().catch(logFetchFailedCause),
    node().getProvenBlockNumber().catch(logFetchFailedCause),
  ]);
  // TODO: if provenBn is constantly behind, we should start storing and displaying it in the UI
  if (bn - provenBn > 0)
    logger.warn(`Difference between block and proven block: ${bn - provenBn}`);

  return bn;
};
