import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL2RpcNode } from "@chicmoz-pkg/types";
import { l2RpcNodeTable } from "../../../schema/l2/rpc-node.js";

export async function storeL2RpcNode(
  rpcUrl: ChicmozL2RpcNode["rpcUrl"]
): Promise<void> {
  const lastSeenAt = new Date();
  await db()
    .insert(l2RpcNodeTable)
    .values({
      rpcUrl,
      lastSeenAt,
    })
    .onConflictDoUpdate({
      target: l2RpcNodeTable.rpcUrl,
      set: {
        lastSeenAt,
      },
    });
}
