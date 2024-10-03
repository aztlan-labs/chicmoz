import { chicmozL2BlockSchema } from "@chicmoz-pkg/types";
import { getCache as c } from "../../../../cache/index.js";
import { controllers as db } from "../../../../database/index.js";
import { dbParseErrorCallback } from "../../../../database/controllers/utils.js";
import {logger} from "../../../../logger.js";

const LATEST_HEIGHT = "latestHeight";

export const getLatestHeight = async () => {
  // NOTE: the reason this is not part of the generic ones is because it's intended to be used by them (at a later stage)
  let val = await c().get(LATEST_HEIGHT);
  if (!val) {
    // TODO: impl getLatestHeight in DB-controller
    const dbRes = await db.l2Block.getLatestBlock().catch(dbParseErrorCallback);
    const block = chicmozL2BlockSchema.parse(dbRes);
    val = block.header.globalVariables.blockNumber;
    if (val) {
      await c().set(LATEST_HEIGHT, val, {
        EX: 2,
      });
    }
  } else {
    logger.info("Cache hit for latest height" + val);
  }
  return val;
};
