import { type Logger } from "@chicmoz-pkg/logger-server";
import { getMicroserviceState, getSvcState, setLogger, setSvcState } from "./health.js";
import { conf, setConfig } from "./config.js";
import { INSTANCE_NAME} from "./environment.js";
import { init } from "./init.js";
import { start } from "./start.js";
import { stop } from "./stop.js";
import {
  MicroserviceBaseSvcState,
  type MicroserviceBaseSvc,
  type MicroserviceConfig,
} from "./types.js";

export {
  INSTANCE_NAME,
  MicroserviceBaseSvcState,
  getMicroserviceState,
  getSvcState,
  setSvcState,
  type MicroserviceBaseSvc,
  type MicroserviceConfig,
};

let logger: Logger;

export const shutdownMicroservice = async (reason: string) => {
  await stop(logger, reason).catch((e) => {
    logger.error(
      `❗ unhandled error during shutdown of ${conf.serviceName}: ${
        (e as Error).stack ?? e
      }`
    );
    process.exit(1);
  });
};

export const startMicroservice = (config: MicroserviceConfig) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGINT", () => shutdownMicroservice("SIGINT"));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGTERM", () => shutdownMicroservice("SIGTERM"));
  logger = config.logger;
  setLogger(logger);
  setConfig(config, logger);
  init(logger)
    .catch((e) => {
      logger.error(
        `❓ unhandled error during initialization (${conf.serviceName}):\n${
          (e as Error).stack ?? e
        }`
      );
      process.exit(1);
    })
    .then(() => start(logger))
    .catch((e) => {
      logger.error(
        `❓❓ unhandled error during startup (${conf.serviceName}):\n${
          (e as Error).stack ?? e
        }`
      );
      process.exit(1);
    });
};

export const isHealthy = () => conf?.services.every((svc) => svc.health());
