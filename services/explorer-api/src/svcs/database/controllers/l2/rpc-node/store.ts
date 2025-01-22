import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL2RpcNode } from "@chicmoz-pkg/types";
import { l2RpcNodeTable } from "../../../schema/l2/rpc-node.js";

export async function storeRpcNode(rpcNode: ChicmozL2RpcNode): Promise<void> {
  const { rpcUrl } = rpcNode;

  await db()
    .insert(l2RpcNodeTable)
    .values({
      rpcUrl,
    })
    .onConflictDoUpdate({
      target: l2RpcNodeTable.rpcUrl,
      set: {
        lastSeenAt: new Date(),
      },
    });
}
