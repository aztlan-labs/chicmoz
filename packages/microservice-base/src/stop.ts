import { type Logger } from "@chicmoz-pkg/logger-server";
import { conf } from "config.js";

export const stop = async (logger: Logger) => {
  logger.warn("👼 Trying to shutdown gracefully...");
  for (const svc of conf.services) {
    logger.info(`💥 Shutting down ${svc.serviceId}...`);
    await svc.shutdown();
  }
  logger.warn("✝ Graceful shutdown complete.");
};
