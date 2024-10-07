import { ChicmozL2Block } from "@chicmoz-pkg/types";
import { blockSchema } from "~/components/blocks/blocks-schema";
import { txEffectSchema } from "~/components/tx-effects/tx-effects-schema";

export const mapLatestBlocks = (latestBlocks: ChicmozL2Block[]) => {
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

export const mapLatestTxEffects = (latestBlocks: ChicmozL2Block[]) => {
  return latestBlocks.flatMap((block) => {
    return block.body.txEffects.map((txEffect) =>
      txEffectSchema.parse({
        hash: txEffect.hash,
        transactionFee: txEffect.transactionFee,
        logCount:
          txEffect.encryptedLogsLength +
          txEffect.unencryptedLogsLength +
          txEffect.noteEncryptedLogsLength,
        blockNumber: block.height,
        timestamp: block.header.globalVariables.timestamp,
      }),
    );
  });
};
