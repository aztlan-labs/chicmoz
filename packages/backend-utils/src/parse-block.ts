import { L2Block } from "@aztec/aztec.js";
import { ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";

const getTxEffectWithHashes = (txEffects: L2Block["body"]["txEffects"]) => {
  return txEffects.map((txEffect) => {
    return {
      ...txEffect,
      unencryptedLogslength: txEffect.unencryptedLogsLength.toNumber(),
      privateLogs: txEffect.privateLogs.map((log) => log.toFields()),
      hash: txEffect.txHash.toString(), // TODO: ⚠️ remove hash from txEffect
      txHash: txEffect.txHash.toString(),
    };
  });
};

export const blockFromString = (stringifiedBlock: string): L2Block => {
  return L2Block.fromString(stringifiedBlock);
};

export const parseBlock = (b: L2Block): ChicmozL2Block => {
  const blockHash = b.hash();

  const blockWithTxEffectsHashesAdded = {
    ...b,
    body: {
      ...b.body,
      txEffects: getTxEffectWithHashes(b.body.txEffects),
    },
  };
  return chicmozL2BlockSchema.parse({
    hash: blockHash.toString(),
    height: b.number,
    ...blockWithTxEffectsHashesAdded,
    header: {
      ...blockWithTxEffectsHashesAdded.header,
      totalFees: blockWithTxEffectsHashesAdded.header.totalFees.toBigInt(),
      contentCommitment: {
        ...blockWithTxEffectsHashesAdded.header.contentCommitment,
        txsEffectsHash: b.header.contentCommitment.blobsHash, // TODO: ⚠️ find real txsEffectsHash (or remove it)
      },
      globalVariables: {
        ...blockWithTxEffectsHashesAdded.header.globalVariables,
        coinbase:
          blockWithTxEffectsHashesAdded.header.globalVariables.coinbase.toString(),
      },
    },
  });
};
