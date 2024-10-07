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
        txHash: txEffect.txHash,
        transactionFee: parseInt(txEffect.transactionFee, 16),
        logCount:
          parseInt(txEffect.encryptedLogsLength, 16) +
          parseInt(txEffect.unencryptedLogsLength, 16) +
          parseInt(txEffect.noteEncryptedLogsLength, 16),
        blockNumber: block.height,
        timestamp: block.header.globalVariables.timestamp,
      }),
    );
  });
};
