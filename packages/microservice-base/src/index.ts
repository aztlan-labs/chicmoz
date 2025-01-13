import { conf, setConfig } from "config.js";
import { init } from "init.js";
import { initLogger, logger } from "logger.js";
import { start } from "start.js";
import { stop } from "stop.js";
import { MicroserviceConfig } from "types.js";

export { logger, type MicroserviceConfig };

export const shutdownMicroservice = async () => {
  await stop().catch((e) => {
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
  process.on("SIGINT", () => shutdownMicroservice());
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGTERM", () => shutdownMicroservice());
  initLogger(conf.serviceName);
  setConfig(config);
  init()
    .catch((e) => {
      logger.error(
        `❓ unhandled error during initialization (${conf.serviceName}):\n${
          (e as Error).stack ?? e
        }`
      );
      process.exit(1);
    })
    .then(start)
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

