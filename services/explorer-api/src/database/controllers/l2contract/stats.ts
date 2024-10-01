import { count } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import { l2ContractClassRegistered } from "../../../database/schema/index.js";

export const getTotalContracts = async (): Promise<number> => {
  const dbRes = await db().select({ count: count() }).from(l2ContractClassRegistered).execute();
  return dbRes[0].count;
};
