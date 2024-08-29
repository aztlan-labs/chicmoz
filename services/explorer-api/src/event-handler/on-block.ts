import { L2Block } from "@aztec/aztec.js";
import { storeBlock } from "../database/index.js";

export const onBlock = async ({ block }: { block: string }) => {
  const b = L2Block.fromString(block);
  await storeBlock(b);
};
