import { SERVICE_NAME } from "./constants.js";
import { logger } from "./logger.js";
import { start } from "./start.js";
import { gracefulShutdown } from "./stop.js";

const main = async () => {
  logger.info(`🚀 ${SERVICE_NAME} starting...`);
  const shutdownCallbacks = await start();
  process.on("SIGINT", gracefulShutdown(shutdownCallbacks));
  process.on("SIGTERM", gracefulShutdown(shutdownCallbacks));
  logger.info(`🥳 ${SERVICE_NAME} started!`);
};

main().catch((e) => {
  logger.error(`during startup of ${SERVICE_NAME}: ${e}`);
  process.exit(1);
});
