import { PXE, createPXEClient } from "@aztec/aztec.js";
import { AZTEC_RPC } from "../constants";

let pxe: PXE;

export const init = () => {
  pxe = createPXEClient(AZTEC_RPC);
  return pxe.getNodeInfo();
};

export const getBlock = (height: number) => {
  if (!pxe) throw new Error("PXE client not initialized");

  return pxe.getBlock(height);
};

export const getBlocks = async (fromHeight: number, toHeight: number) => {
  if (!pxe) throw new Error("PXE client not initialized");
  const blocks = [];
  for (let i = fromHeight; i < toHeight; i++) {
    const block = await pxe.getBlock(i);
    blocks.push(block);
  }
  return blocks;
}

export const getLatestHeight = () => {
  if (!pxe) throw new Error("PXE client not initialized");

  return pxe.getBlockNumber();
};
