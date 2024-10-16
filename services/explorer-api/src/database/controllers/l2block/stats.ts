import { sql } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { header } from "../../../database/schema/index.js";

export const getAverageFees = async (): Promise<string> => {
  const dbRes = await db()
    .select({
      average: sql<string>`cast(avg(${header.totalFees}) as numeric)`,
    })
    .from(header)
    .execute();
  return dbRes[0].average.split(".")[0];
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getAverageBlockTime = async (): Promise<number> => {
  // TODO: we need l2Block.header.globalVariables.timestamp as number to average this
  return -1;
};
