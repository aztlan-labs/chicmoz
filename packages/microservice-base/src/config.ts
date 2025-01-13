import { INSTANCE_NAME } from "environment.js";
import { logger } from "logger.js";
import { MicroserviceConfig } from "types.js";

export let conf: MicroserviceConfig;

export const setConfig = (config: MicroserviceConfig) => {
  conf = config;
  logger.info(
    `🏗 service: ${conf.serviceName}
instance: ${INSTANCE_NAME}
config:\n${conf.formattedConfig}\n`
  );
  if (process.env.SERVICE_NAME) {
    logger.warn(
      `🚨🚨🚨 SERVICE_NAME env-var is deprecated, please use the serviceName field in the config object instead. (And start using INSTANCE_NAME)`
    );
  }
};
