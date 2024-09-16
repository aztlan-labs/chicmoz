// TODO: why unsafe?
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  createAztecNodeClient,
  AztecNode,
  NodeInfo,
} from "@aztec/aztec.js";
import { AZTEC_RPC } from "../constants.js";

let aztecNode: AztecNode;

const node = () => {
  if (!aztecNode) throw new Error("Node not initialized");
  return aztecNode;
};

export const init = async () => {
  aztecNode = createAztecNodeClient(AZTEC_RPC);
  return getNodeInfo();
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
    n.getNodeVersion(),
    n.getVersion(),
    n.getChainId(),
    n.getEncodedEnr(),
    n.getL1ContractAddresses(),
    n.getProtocolContractAddresses(),
  ]);

  const nodeInfo: NodeInfo = {
    nodeVersion,
    l1ChainId: chainId,
    protocolVersion,
    enr,
    l1ContractAddresses: contractAddresses,
    protocolContractAddresses: protocolContractAddresses,
  };

  // TODO: why unsafe?
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return nodeInfo;
};

export const getBlock = async (height: number) => node().getBlock(height);

export const getBlocks = async (fromHeight: number, toHeight: number) => {
  const blocks = [];
  for (let i = fromHeight; i < toHeight; i++) {
    const block = await node().getBlock(i);
    blocks.push(block);
  }
  return blocks;
};

export const getLatestHeight = () => node().getBlockNumber();
