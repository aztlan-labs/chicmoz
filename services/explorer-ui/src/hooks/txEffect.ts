import { type ChicmozL2TxEffect } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { TxEffectsAPI } from "~/api";

export const useTxEffects = (blockHeight: number): UseQueryResult<ChicmozL2TxEffect[], Error> => {
  return useQuery<ChicmozL2TxEffect[], Error>({
    queryKey: [blockHeight],
    queryFn: () => TxEffectsAPI.getTxEffectsByHeight(blockHeight),
  });
};
