import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT } from "../environment.js";
import { logger } from "../logger.js";

let cache: ReturnType<typeof createClient>;
let isInitialized = false;
let isShutDown = false;

export const init = async () => {
  cache = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  });
  await cache.connect();
  isInitialized = true;

  return {
    id: "CACHE",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      logger.info(`Shutting down cache...`);
      isShutDown = true;
      await cache.disconnect();
    },
  };
};

export const getCache = () => {
  if (!isInitialized) throw new Error("Cache not initialized");
  if (isShutDown) throw new Error("Cache has been shut down");
  return cache;
}
