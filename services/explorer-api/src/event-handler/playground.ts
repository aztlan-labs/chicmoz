/* eslint-disable @typescript-eslint/require-await */
import {L2Block} from "@aztec/aztec.js";
import {logger} from "../logger.js";

export const play1 = async (block: L2Block) => {
  logger.info("play1", block.hash());
};
