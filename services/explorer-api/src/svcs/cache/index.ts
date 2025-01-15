import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT } from "../../environment.js";
import {MicroserviceBaseSvc} from "@chicmoz-pkg/microservice-base";

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
};

export const getCache = () => {
  if (!isInitialized) throw new Error("Cache not initialized");
  if (isShutDown) throw new Error("Cache has been shut down");
  return cache;
};

export const cacheService: MicroserviceBaseSvc = {
  serviceId: "CACHE",
  init,
  getConfigStr: () => `REDIS\n${JSON.stringify({ REDIS_HOST, REDIS_PORT })}`,
  health: () => isInitialized && !isShutDown,
  shutdown: async () => {
    isShutDown = true;
    await cache.disconnect();
  },
};
