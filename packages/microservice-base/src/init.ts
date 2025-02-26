import { type Logger } from "@chicmoz-pkg/logger-server";
import { conf } from "./config.js";
import { setSvcState } from "./health.js";
import { MicroserviceBaseSvcState } from "./types.js";

export const init = async (logger: Logger) => {
  if (conf.services.length === 0) {
    logger.warn("No services to initialize.");
    return;
  }
  for (const svc of conf.services) {
    setSvcState(svc.svcId, MicroserviceBaseSvcState.INITIALIZING);
  }

  for (const [index, svc] of conf.services.entries()) {
    logger.info(
      `🔧 ${svc.svcId} [${index + 1} of ${
        conf.services.length
      }] initializing with config:\n${svc.getConfigStr()}`
    );
    await svc.init();
    setSvcState(svc.svcId, MicroserviceBaseSvcState.UP);
  }
  logger.info(`🍾 ${conf.serviceName} initalized!`);
};
