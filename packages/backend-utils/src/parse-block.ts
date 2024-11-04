import { L2Block } from "@aztec/aztec.js";
import { ChicmozL2Block, chicmozL2BlockSchema } from "@chicmoz-pkg/types";

const getTxEffectWithHashes = (txEffects: L2Block["body"]["txEffects"]) => {
  return txEffects.map((txEffect) => {
    return {
      ...txEffect,
      hash: "0x" + txEffect.hash().toString("hex"),
      txHash: txEffect.txHash
    };
  });
};

export const blockFromString = (stringifiedBlock: string): L2Block => {
  return L2Block.fromString(stringifiedBlock);
}

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
    ...JSON.parse(JSON.stringify(blockWithTxEffectsHashesAdded)),
  });
};
