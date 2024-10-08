import { getCache as c } from "../../../../cache/index.js";
import { controllers as db } from "../../../../database/index.js";
import { dbParseErrorCallback } from "../../../../database/controllers/utils.js";
import {
  CACHE_LATEST_TTL_SECONDS,
  CACHE_TTL_SECONDS,
} from "../../../../environment.js";

const LATEST_HEIGHT = "latestHeight";

export const getLatestHeight = async () => {
  const cachedVal = await c().get(LATEST_HEIGHT);
  let dbVal = null;
  if (!cachedVal) {
    // TODO: impl getLatestHeight in DB-controller
    const block = await db.l2Block.getLatestBlock().catch(dbParseErrorCallback);
    dbVal = block?.header.globalVariables.blockNumber ?? null;
    if (dbVal) {
      await c().set(LATEST_HEIGHT, dbVal, {
        EX: CACHE_LATEST_TTL_SECONDS,
      });
    }
  }
  if (!cachedVal && !dbVal)
    throw new Error("CACHE_ERROR: latest height not found");
  return cachedVal ?? dbVal;
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
  let val = await c().get(cacheKey);
  if (val === null || val === undefined) {
    const dbRes = await dbFn().catch(dbParseErrorCallback);
    if (dbRes !== null && dbRes !== undefined) {
      val = JSON.stringify(dbRes);
      await c().set(cacheKey, val, {
        EX: ttl,
      });
    }
  }
  if (val === null || val === undefined)
    throw new Error(`${cacheKey} not found`);
  return val;
};
