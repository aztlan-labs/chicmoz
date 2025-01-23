import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL2Sequencer } from "@chicmoz-pkg/types";
import { l2RpcNodeTable } from "../../../schema/l2/rpc-node.js";
import { l2SequencerTable } from "../../../schema/l2/sequencer.js";

export async function storeL2Sequencer(
  sequencer: ChicmozL2Sequencer
): Promise<void> {
  const {
    enr,
    rpcUrl,
    l2NetworkId,
    protocolVersion,
    nodeVersion,
    l1ChainId,
    lastSeenAt,
  } = sequencer;

  await db().transaction(async (tx) => {
    const rpcNodeRes = await tx
      .insert(l2RpcNodeTable)
      .values({
        rpcUrl,
      })
      .onConflictDoUpdate({
        target: l2RpcNodeTable.rpcUrl,
        set: {
          lastSeenAt,
        },
      })
      .returning({ id: l2RpcNodeTable.id });
    const rpcNode = rpcNodeRes[0];
    await tx
      .insert(l2SequencerTable)
      .values({
        enr,
        rpcNodeId: rpcNode.id,
        l2NetworkId,
        protocolVersion,
        nodeVersion,
        l1ChainId,
        lastSeenAt,
      })
      .onConflictDoUpdate({
        target: l2SequencerTable.enr,
        set: {
          rpcNodeId: rpcNode.id,
          l2NetworkId,
          protocolVersion,
          nodeVersion,
          l1ChainId,
          lastSeenAt,
        },
      });
  });
}
