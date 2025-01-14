import { type Logger } from "@chicmoz-pkg/logger-server";
import { conf } from "./config.js";

export const init = async (logger: Logger) => {
  if (conf.services.length === 0) {
    logger.warn("No services to initialize.");
    return;
  }
  for (const [index, svc] of conf.services.entries()) {
    logger.info(`🔧 [${index + 1} of ${conf.services.length}] Initializing ${svc.serviceId}...`);
    await svc.init();
    logger.info(`👍 ${svc.serviceId} initialized!`);
  }
  logger.info(`🍾 ${conf.serviceName} initalized!`);
};
