import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { ConnectedToL2Event } from "@chicmoz-pkg/message-registry";
import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { aztecChainConnection } from "../schema/aztec-chain-connection.js";
import { createHash } from "crypto";
import { logger } from "../../../logger.js";

const hashString = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};

const generateStoreObject = (connectionInfo: ConnectedToL2Event) => {
  const jsonString = JSON.stringify({
    ...connectionInfo.nodeInfo,
    rpcUrl: connectionInfo.rpcUrl,
  });
  return {
    hash: hashString(jsonString),
    chainHeight: connectionInfo.chainHeight,
    latestProcessedHeight: connectionInfo.latestProcessedHeight,
    rpcUrl: connectionInfo.rpcUrl,
    ...connectionInfo.nodeInfo,
  };
};

export const store = async (connectionInfo: ConnectedToL2Event) => {
  const storeObject = generateStoreObject(connectionInfo);
  return await db().transaction(async (dbTx) => {
    await dbTx
      .insert(aztecChainConnection)
      .values(storeObject)
      .onConflictDoNothing()
      .execute();
    await dbTx
      .update(aztecChainConnection)
      .set({
        counter: sql`${aztecChainConnection.counter} + 1`,
        latestProcessedHeight: storeObject.latestProcessedHeight,
        chainHeight: storeObject.chainHeight,
        updatedAt: new Date(),
      })
      .where(eq(aztecChainConnection.hash, storeObject.hash))
      .execute();
  });
};

const intervals = [
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

const formatTimeSince = (unixTimestamp: number | null) => {
  if (unixTimestamp === null) return "no timestamp";
  const now = new Date().getTime();
  const secondsSince = Math.round((now - unixTimestamp) / 1000);
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(secondsSince / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export const getLatestWithRedactedRpc = async () => {
  const res = await db()
    .select({ ...getTableColumns(aztecChainConnection) })
    .from(aztecChainConnection)
    .orderBy(desc(aztecChainConnection.updatedAt))
    .limit(1)
    .execute();
  if (res.length === 0) return null;
  logger.info(`🔍 Latest connection url: ${JSON.stringify(res[0].rpcUrl)}`);
  return {
    ...res[0],
    timeSinceCreated: formatTimeSince(res[0].createdAt.getTime()),
    timeSinceUpdated: formatTimeSince(res[0].updatedAt.getTime()),
    rpcUrlHASH: hashString(res[0].rpcUrl),
  };
};
