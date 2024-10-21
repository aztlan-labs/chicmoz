import { getCache as c } from "../../../../cache/index.js";
import { controllers as db } from "../../../../database/index.js";
import { dbParseErrorCallback } from "../../../../database/controllers/utils.js";
import {
  CACHE_LATEST_TTL_SECONDS,
  CACHE_TTL_SECONDS,
} from "../../../../environment.js";

const cacheCounter: Record<string, { hits: number; misses: number }> = {};

const LATEST_HEIGHT = "latestHeight";

const incrementCounter = (key: string, isHit: boolean) => {
  if (!cacheCounter[key]) cacheCounter[key] = { hits: 0, misses: 0 };

  if (isHit) cacheCounter[key].hits += 1;
  else cacheCounter[key].misses += 1;
};

export const getLogCounter = () => {
  return cacheCounter;
};

export const getLatestHeight = async () => {
  const cachedVal = await c().get(LATEST_HEIGHT);
  const isCached = cachedVal !== null && cachedVal !== undefined;
  if (isCached) {
    incrementCounter(LATEST_HEIGHT, true);
    return cachedVal;
  }
  const dbVal = await db.l2Block.getLatestHeight().catch(dbParseErrorCallback);
  if (dbVal) {
    await c().set(LATEST_HEIGHT, dbVal, {
      EX: CACHE_LATEST_TTL_SECONDS,
    });
    incrementCounter(LATEST_HEIGHT, false);
    return dbVal;
  }
  throw new Error("CACHE_ERROR: latest height not found");
};

export const getLatest = async <DbReturnType>(
  keys: (string | number | undefined)[],
  dbFn: () => Promise<DbReturnType>
): Promise<string> => {
  const latestHeight = await getLatestHeight();
  if (!latestHeight) throw new Error("CACHE_ERROR: latest height not found");
  // NOTE: we add one second to the TTL to ensure that stale cache is not stored
  return get([...keys, latestHeight], dbFn, CACHE_LATEST_TTL_SECONDS + 1);
};

export const get = async <DbReturnType>(
  keys: (string | number | undefined)[],
  dbFn: () => Promise<DbReturnType>,
  ttl = CACHE_TTL_SECONDS
): Promise<string> => {
  const cacheKey = keys.join("-");
  const cachedVal = await c().get(cacheKey);
  const isCached = cachedVal !== null && cachedVal !== undefined;
  if (isCached) {
    incrementCounter(cacheKey, true);
    return cachedVal;
  }
  const dbRes = await dbFn().catch(dbParseErrorCallback);
  if (dbRes !== null && dbRes !== undefined) {
    const dbVal = JSON.stringify(dbRes);
    await c().set(cacheKey, dbVal, {
      EX: ttl,
    });
    incrementCounter(cacheKey, false);
    return dbVal;
  }
  throw new Error(`${cacheKey} not found`);
};
