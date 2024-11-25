import { type ChicmozL2BlockLight } from "@chicmoz-pkg/types";
import { blockSchema } from "~/components/blocks/blocks-schema";
import {
  type TxEffectTableSchema,
  getTxEffectTableObj,
} from "~/components/tx-effects/tx-effects-schema";
import { type useGetTxEffectsByBlockHeightRange } from "~/hooks";

export const mapLatestBlocks = (latestBlocks?: ChicmozL2BlockLight[]) => {
  if (!latestBlocks) return undefined;
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

export const parseTxEffectsData = (
  txEffectsData: ReturnType<typeof useGetTxEffectsByBlockHeightRange>,
  latestBlocks?: ChicmozL2BlockLight[]
) => {
  let isLoadingTxEffects = false;
  let txEffectsErrorMsg: string | undefined = undefined;

  let latestTxEffects: TxEffectTableSchema[] = [];
  txEffectsData.forEach((data, i) => {
    if (data.isLoading) isLoadingTxEffects = true;
    if (data.error) txEffectsErrorMsg = data.error.message;
    if (data.data) {
      if (!latestBlocks) return;
      const newTxEffects = data.data.reduce((acc, txEffect) => {
        if (txEffect === undefined) return acc;
        if (latestBlocks[i] === undefined) return acc;
        return acc.concat(getTxEffectTableObj(txEffect, latestBlocks[i]));
      }, latestTxEffects);
      latestTxEffects = newTxEffects;
    }
  });
  return {
    isLoadingTxEffects,
    txEffectsErrorMsg,
    latestTxEffects,
  };
};
