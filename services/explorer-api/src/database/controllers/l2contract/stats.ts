import { and, count, eq, gt, lt } from "drizzle-orm";
import { getDb as db } from "../../../database/index.js";
import {
  globalVariables,
  header,
  l2Block,
  l2ContractClassRegistered,
} from "../../../database/schema/index.js";

export const getTotalContracts = async (): Promise<number> => {
  const dbRes = await db()
    .select({ count: count() })
    .from(l2ContractClassRegistered)
    .execute();
  return dbRes[0].count;
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export const getTotalContractsLast24h = async (): Promise<number> => {
  const dbRes = await db()
    .select({ count: count() })
    .from(l2ContractClassRegistered)
    .innerJoin(l2Block, eq(l2Block.hash, l2ContractClassRegistered.blockHash))
    .innerJoin(header, eq(header.id, l2Block.headerId))
    .innerJoin(
      globalVariables,
      eq(globalVariables.id, header.globalVariablesId)
    )
    .where(
      and(
        gt(globalVariables.timestamp, Date.now() - ONE_DAY),
        lt(globalVariables.timestamp, Date.now())
      )
    )
    .execute();
  return dbRes[0].count;
};
