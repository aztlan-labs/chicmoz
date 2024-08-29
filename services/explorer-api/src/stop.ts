import { SERVICE_NAME } from "./constants.js";
import { logger } from "./logger.js";

// TODO: use types from relevant files
export type ShutdownCallbacks = {
  shutdownMb: () => Promise<void>;
  shutdownHttpServer: () => Promise<void>;
  shutdownDb: () => Promise<void>;
};

const _gracefulShutdown = async (callbacks: ShutdownCallbacks) => {
  try {
    await Promise.all([
      await callbacks.shutdownHttpServer(),
      await callbacks.shutdownMb(),
    ]);
    await callbacks.shutdownDb();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`during shutdown of ${SERVICE_NAME}: ${e}`);
    process.exit(1);
  }
};

export const gracefulShutdown = (callbacks: ShutdownCallbacks) => async () => {
  logger.info("Starting graceful shutdown...");
  await _gracefulShutdown(callbacks);
  logger.info("Graceful shutdown complete.");
};
