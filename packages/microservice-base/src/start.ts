import { logger } from "logger.js";
import { conf } from "config.js";

export const start = async () => {
  logger.info("🚀 Starting microservice...");
  await conf.startCallback();
  logger.info(`🥳 ${conf.serviceName} started!`);
};
