import { INSTANCE_NAME, logFriendlyConfig } from "./constants.js";
import {
  startMicroservice,
  type MicroserviceConfig,
} from "@chicmoz-pkg/microservice-base";
import { start } from "./start.js";
import { logger } from "./logger.js";
import { services } from "./svcs/index.js";
import {messageBusConfigStr} from "./svcs/message-bus/index.js";

// 1. make a nice formatted config-log
// 2. use init microservice base
// 3. evaluate if DB-package could be extracted to a separate package
// 4. evaluate if MB-package could be extracted to a separate package
// 5. merge and look into another service

const formatConfigLog = () => {
  const mbStr = messageBusConfigStr();
  return JSON.stringify(logFriendlyConfig, null, 2) + mbStr;
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
