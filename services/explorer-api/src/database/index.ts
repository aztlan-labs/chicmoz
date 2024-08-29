import { L2Block } from "@aztec/aztec.js";
import { logger } from "../logger.js";

// TODO: type only part of L2Block
let latestBlock: Partial<L2Block>;

// eslint-disable-next-line @typescript-eslint/require-await
export const init = async () => {
  logger.info("DB: TODO");
  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownDb: async () => {
      logger.info("DB: TODO");
    },
  };
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getLatestBlock = async () => {
  return latestBlock;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const storeBlock = async (block: L2Block) => {
  logger.info(`Storing block ${block.number}`);
  latestBlock = block;
}
