import { INSTANCE_NAME, logFriendlyConfig } from "./constants.js";
import {
  startMicroservice,
  type MicroserviceConfig,
} from "@chicmoz-pkg/microservice-base";
import { start } from "./start.js";
import { logger } from "./logger.js";
import { services } from "./svcs/index.js";

const formatConfigLog = () => {
  return JSON.stringify(logFriendlyConfig, null, 2);
};

const main = () => {
  const config: MicroserviceConfig = {
    instanceName: INSTANCE_NAME,
    logger,
    logConfig: formatConfigLog(),
    services,
    startCallback: start,
  };
  startMicroservice(config);
};

main();
