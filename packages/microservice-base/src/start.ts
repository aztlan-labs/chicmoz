import { type Logger } from "@chicmoz-pkg/logger-server";
import { conf } from "config.js";

export const start = async (logger: Logger) => {
  logger.info("🚀 Starting microservice...");
  await conf.startCallback();
  logger.info(`🥳 ${conf.serviceName} started!`);
};
