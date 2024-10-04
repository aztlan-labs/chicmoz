import { and, gte, lt } from "drizzle-orm";
import { ZodError } from "zod";
import { logger } from "../../logger.js";
import { DB_MAX_BLOCKS } from "../../environment.js";
import { l2Block } from "../schema/index.js";

export const dbParseErrorCallback = (e: Error) => {
  if (e instanceof ZodError) {
    logger.error(`FATAL - dbParseErrorCallback: ${JSON.stringify(e.issues)}`);
    // NOTE: throwing normal error so we give 500 status code in http-server
    throw new Error("Internal server error (DB)");
  } else {
    // NOTE: this should never happen
    logger.error(
      `BIG PROBLEM - dbParseErrorCallback: returned an error that is not ZodError: ${e.message}`
    );
    throw e;
  }
};

export const getBlocksWhereRange = ({
  from,
  to,
}: {
  from: number | undefined;
  to: number | undefined;
}) => {
  let whereRange;
  if (to && from) {
    if (from > to) throw new Error("Invalid range: from is greater than to");
    if (to - from > DB_MAX_BLOCKS)
      throw new Error("Invalid range: too wide of a range requested");
    whereRange = and(gte(l2Block.height, from), lt(l2Block.height, to));
  } else if (from) {
    whereRange = and(
      gte(l2Block.height, from),
      lt(l2Block.height, from + DB_MAX_BLOCKS)
    );
  } else if (to) {
    whereRange = lt(l2Block.height, to);
  } else {
    whereRange = undefined;
  }
  return whereRange;
};
