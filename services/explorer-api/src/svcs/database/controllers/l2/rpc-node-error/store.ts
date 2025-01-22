import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL2RpcNodeError } from "@chicmoz-pkg/types";
import { sql } from "drizzle-orm";
import { l2RpcNodeErrorTable } from "../../../schema/l2/rpc-node-error.js";

export async function storeRpcNodeError(
  rpcNodeError: ChicmozL2RpcNodeError
): Promise<void> {
  const { name, rpcUrl, cause, message, stack, data } = rpcNodeError;

  await db()
    .insert(l2RpcNodeErrorTable)
    .values({
      name,
      rpcUrl,
      cause,
      message,
      stack,
      data,
    })
    .onConflictDoUpdate({
      target: [l2RpcNodeErrorTable.name, l2RpcNodeErrorTable.rpcUrl],
      set: {
        cause,
        message,
        stack,
        data,
        count: sql`${l2RpcNodeErrorTable.count} + 1`,
        lastSeenAt: new Date(),
      },
    });
}
