import { sql } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { header } from "../../../database/schema/index.js";

export const getAverageFees = async (): Promise<number> => {
  const dbRes = await db()
    .select({
      average: sql<number>`COALESCE(avg(${header.totalFees}), 0)`.as("average"),
    })
    .from(header)
    .execute();
  return dbRes[0].average;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getAverageBlockTime = async (): Promise<number> => {
  // TODO: we need l2Block.header.globalVariables.timestamp as number to average this
  return -1;
};
