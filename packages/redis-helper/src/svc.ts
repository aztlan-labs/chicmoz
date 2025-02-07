import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { L2NetworkId } from "@chicmoz-pkg/types";
import { createClient } from "redis";
import { REDIS_HOST, REDIS_PORT, getConfigStr } from "./environment.js";

let cache: ReturnType<typeof createClient>;
let isInitialized = false;
let isShutDown = false;
let l2NetworkId: L2NetworkId;

export const init = async (l2NetwId?: L2NetworkId) => {
  if (l2NetwId === undefined) throw new Error("L2 Network ID not provided");
  l2NetworkId = l2NetwId;
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

export type CacheKeys = (string | number | bigint | undefined)[];
export type CacheValue = string | number;

export const setEntry = async (
  keys: CacheKeys,
  value: CacheValue,
  secondsTtl: number
) => {
  return await getCache().set([l2NetworkId, ...keys].join("-"), value, {
    EX: secondsTtl,
  });
};

export const getEntry = async (keys: CacheKeys) => {
  const keysStr = [l2NetworkId, ...keys].join("-");
  const value = await getCache().get(keysStr);
  return {
    keysStr,
    value,
  };
};

export const cacheService: MicroserviceBaseSvc = {
  svcId: "CACHE",
  init,
  getConfigStr,
  health: () => isInitialized && !isShutDown,
  shutdown: async () => {
    isShutDown = true;
    await cache.disconnect();
  },
};
