import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL2Sequencer } from "@chicmoz-pkg/types";
import { l2SequencerTable } from "../../../schema/l2/sequencer.js";

export async function storeSequencer(
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

  await db()
    .insert(l2SequencerTable)
    .values({
      enr,
      rpcUrl,
      l2NetworkId,
      protocolVersion,
      nodeVersion,
      l1ChainId,
      lastSeenAt,
    })
    .onConflictDoUpdate({
      target: l2SequencerTable.enr,
      set: {
        rpcUrl,
        l2NetworkId,
        protocolVersion,
        nodeVersion,
        l1ChainId,
        lastSeenAt,
      },
    });
}
