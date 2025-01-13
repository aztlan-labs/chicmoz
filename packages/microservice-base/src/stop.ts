import { conf } from "config.js";
import { logger } from "./logger.js";

export const stop = async () => {
  logger.warn("👼 Trying to shutdown gracefully...");
  for (const svc of conf.services) {
    logger.info(`💥 Shutting down ${svc.serviceId}...`);
    await svc.shutdown();
  }
  logger.warn("✝ Graceful shutdown complete.");
};
