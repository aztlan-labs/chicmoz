import { type ChicmozL2TxEffect } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { TxEffectsAPI } from "~/api";

export const useGetTxEffectByHash = (
  id: string,
): UseQueryResult<ChicmozL2TxEffect, Error> => {
  return useQuery<ChicmozL2TxEffect, Error>({
    queryKey: ["txEffectByHash", id],
    queryFn: () => TxEffectsAPI.getTxEffectByHash(id),
  });
};
