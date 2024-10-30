//import { getBlock, getLatestHeight } from "./client.js";
//import { emit } from "../events/index.js";
import { logger } from "../logger.js";
import { getContractsEvents } from "./client.js";

export const start = async () => {
  logger.info(`ETH: start polling`);
  await getContractsEvents();
};

export const stop = () => {
  logger.info(`ETH: stop polling`);
};
