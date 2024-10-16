import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { ConnectedToAztecEvent } from "@chicmoz-pkg/message-registry";
import { getDb as db } from "../../database/index.js";
import { aztecChainConnection } from "../schema/aztec-chain-connection.js";
import { createHash } from "crypto";
import { logger } from "../../logger.js";

const hashString = (str: string) => {
  return createHash("sha256").update(str).digest("hex");
};

const hash = (connectionInfo: ConnectedToAztecEvent) => {
  const jsonString = JSON.stringify({
    ...connectionInfo.nodeInfo,
    rpcUrl: connectionInfo.rpcUrl,
  });
  return hashString(jsonString);
};

export const store = async (connectionInfo: ConnectedToAztecEvent) => {
  const hashValue = hash(connectionInfo);
  return await db().transaction(async (dbTx) => {
    await dbTx
      .insert(aztecChainConnection)
      .values({
        hash: hashValue,
        updatedAt: new Date(),
        chainHeight: connectionInfo.chainHeight,
        latestProcessedHeight: connectionInfo.latestProcessedHeight,
        rpcUrl: connectionInfo.rpcUrl,
        ...connectionInfo.nodeInfo,
      })
      .execute();
    await dbTx
      .update(aztecChainConnection)
      .set({
        counter: sql`${aztecChainConnection.counter} + 1`,
      })
      .where(eq(aztecChainConnection.hash, hashValue))
      .execute();
  });
};

export const getLatestWithRedactedRpc = async () => {
  const res = await db()
    .select({ ...getTableColumns(aztecChainConnection) })
    .from(aztecChainConnection)
    .orderBy(desc(aztecChainConnection.updatedAt))
    .limit(1)
    .execute();
  if (res.length === 0) return null;
  logger.info(`🔍 Latest connection info ${JSON.stringify(res[0])}`);
  return {
    ...res[0],
    rpcUrl: hashString(res[0].rpcUrl),
  };
};
