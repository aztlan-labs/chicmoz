import { getCache as c } from "../../../../cache/index.js";
import { controllers as db } from "../../../../database/index.js";
import { dbParseErrorCallback } from "../../../../database/controllers/utils.js";
import { CACHE_TTL_SECONDS } from "../../../../environment.js";

const LATEST_HEIGHT = "latestHeight";
const LATEST_TTL_SECONDS = 2;

export const getLatestHeight = async () => {
  let val = await c().get(LATEST_HEIGHT);
  if (!val) {
    // TODO: impl getLatestHeight in DB-controller
    const block = await db.l2Block.getLatestBlock().catch(dbParseErrorCallback);
    val = block?.header.globalVariables.blockNumber ?? null;
    if (val) {
      await c().set(LATEST_HEIGHT, val, {
        EX: LATEST_TTL_SECONDS,
      });
    }
  }
  return val;
};

export const getLatest = async <DbReturnType>(
  keys: string[],
  dbFn: () => Promise<DbReturnType>
): Promise<string | null> => {
  const latestHeight = await getLatestHeight();
  if (!latestHeight) return null;
  // NOTE: we add one second to the TTL to ensure that stale cache is not stored
  return get([...keys, latestHeight], dbFn, LATEST_TTL_SECONDS + 1);
};

export const get = async <DbReturnType>(
  keys: (string | number | undefined)[],
  dbFn: () => Promise<DbReturnType>,
  ttl = CACHE_TTL_SECONDS
): Promise<string | null> => {
  const cacheKey = keys.join("-");
  let val = await c().get(cacheKey);
  if (!val) {
    const dbRes = await dbFn().catch(dbParseErrorCallback);
    if (dbRes) {
      val = JSON.stringify(dbRes);
      await c().set(cacheKey, val, {
        EX: ttl,
      });
    }
  }
  return val;
};
