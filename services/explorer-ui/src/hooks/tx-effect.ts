import { type ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { TxEffectsAPI } from "~/api";

export const useGetTxEffectByHash = (
  id: string,
): UseQueryResult<ChicmozL2TxEffectDeluxe, Error> => {
  return useQuery<ChicmozL2TxEffectDeluxe, Error>({
    queryKey: ["txEffectByHash", id],
    queryFn: () => TxEffectsAPI.getTxEffectByHash(id),
  });
};
