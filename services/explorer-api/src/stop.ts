import { SERVICE_NAME } from "./constants.js";
import { logger } from "./logger.js";

const registeredShutdownCallbacks: (() => Promise<void>)[] = [];

export const registerShutdownCallback = (callback: () => Promise<void>) => {
  registeredShutdownCallbacks.push(callback);
};

const _gracefulShutdown = async () => {
  try {
    for (const callback of registeredShutdownCallbacks) await callback();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`during shutdown of ${SERVICE_NAME}: ${e}`);
    process.exit(1);
  }
};

export const gracefulShutdown = () => async () => {
  logger.info("Starting graceful shutdown...");
  await _gracefulShutdown();
  logger.info("Graceful shutdown complete.");
};
