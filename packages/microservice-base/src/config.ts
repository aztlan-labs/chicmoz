import { type Logger } from "@chicmoz-pkg/logger-server";
import { DEFAULT_INSTANCE_NAME, INSTANCE_NAME, NODE_ENV } from "./environment.js";
import { MicroserviceConfig } from "./types.js";

export let conf: MicroserviceConfig;

export const setConfig = (config: MicroserviceConfig, logger: Logger) => {
  const isUsingDefaultInstanceName = INSTANCE_NAME === DEFAULT_INSTANCE_NAME;
  if (NODE_ENV === "production" && isUsingDefaultInstanceName) throw new Error("Using default INSTANCE_NAME in production is not allowed");
  conf = config;
  logger.info(
    `🏗 service: ${conf.serviceName}
instance: ${isUsingDefaultInstanceName ? "(🚨 using default)" : ""}${INSTANCE_NAME}
config:\n${conf.formattedConfig}\n`
  );
  if (process.env.SERVICE_NAME) {
    logger.warn(
      `🚨🚨🚨 SERVICE_NAME env-var is deprecated, please use the serviceName field in the config object instead. (And start using INSTANCE_NAME)`
    );
  }
};
