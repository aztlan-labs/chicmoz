import { conf } from "config.js";
import { logger } from "logger.js";

export const init = async () => {
  if (conf.services.length === 0) {
    logger.warn("No services to initialize.");
    return;
  }
  for (const svc of conf.services) {
    logger.info(`🔧 Initializing ${svc.serviceId}...`);
    await svc.init();
    logger.info(`👍 ${svc.serviceId} initialized!`);
  }
  await conf.startCallback();
  logger.info(`🥳 ${conf.serviceName} started!`);
};
