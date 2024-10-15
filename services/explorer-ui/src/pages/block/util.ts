import { type ChicmozL2Block } from "@chicmoz-pkg/types";
import { blockSchema } from "~/components/blocks/blocks-schema";

export const parseLatestBlocks = (latestBlocks: ChicmozL2Block[]) => {
  return latestBlocks.map((block) => {
    return blockSchema.parse({
      height: block.height,
      blockHash: block.hash,
      numberOfTransactions: block.header.contentCommitment.numTxs,
      txEffectsLength: block.body.txEffects.length,
      totalFees: block.header.totalFees,
      timestamp: block.header.globalVariables.timestamp,
    });
  });
};
