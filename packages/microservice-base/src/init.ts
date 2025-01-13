import { conf } from "config.js";
import { initLogger, logger } from "logger.js";

export const init = async () => {
  initLogger(conf.serviceName);
  logger.info(
    `🏗 ${conf.serviceName} initializing services, with config:\n${conf.formattedConfig}\n`
  );
  for (const svc of conf.services) {
    logger.info(`🔧 Initializing ${svc.serviceId}...`);
    await svc.init();
    logger.info(`👍 ${svc.serviceId} initialized!`);
  }
  await conf.startCallback();
  logger.info(`🥳 ${conf.serviceName} started!`);
};
