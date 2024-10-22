import { type ChicmozL2BlockLight } from "@chicmoz-pkg/types";
import { blockSchema } from "~/components/blocks/blocks-schema";

export const parseLatestBlocks = (latestBlocks: ChicmozL2BlockLight[]) => {
  return latestBlocks.map((block) => {
    return blockSchema.parse({
      height: block.height,
      blockHash: block.hash,
      txEffectsLength: block.body.txEffects.length,
      totalFees: block.header.totalFees,
      timestamp: block.header.globalVariables.timestamp,
    });
  });
};
