import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { createClient } from "redis";
import { L2_NETWORK_ID, REDIS_HOST, REDIS_PORT } from "../../environment.js";

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

const getCache = () => {
  if (!isInitialized) throw new Error("Cache not initialized");
  if (isShutDown) throw new Error("Cache has been shut down");
  return cache;
};

export const setEntry = async (
  keys: (string | number | undefined)[],
  value: string | number,
  secondsTtl: number
) => {
  return await getCache().set(
    [L2_NETWORK_ID, ...keys].join("-"),
    value,
    { EX: secondsTtl }
  );
};

export const getEntry = async (keys: (string | number | undefined)[]) => {
  return await getCache().get([L2_NETWORK_ID, ...keys].join("-"));
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
