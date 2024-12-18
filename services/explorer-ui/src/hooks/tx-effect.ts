import { type ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";
import {
  type UseQueryResult,
  useQuery,
  useQueries,
} from "@tanstack/react-query";
import { TxEffectsAPI } from "~/api";
import { queryKeyGenerator } from "./utils";

export const useGetTxEffectByHash = (
  hash: string
): UseQueryResult<ChicmozL2TxEffectDeluxe, Error> => {
  return useQuery<ChicmozL2TxEffectDeluxe, Error>({
    queryKey: queryKeyGenerator.txEffectByHash(hash),
    queryFn: () => TxEffectsAPI.getTxEffectByHash(hash),
  });
};

export const useGetTxEffectsByBlockHeight = (
  height: number | string | undefined
): UseQueryResult<ChicmozL2TxEffectDeluxe[], Error> => {
  if (typeof height === "string" && height?.startsWith("0x"))
    throw new Error("Invalid block height");
  return useQuery<ChicmozL2TxEffectDeluxe[], Error>({
    queryKey: queryKeyGenerator.txEffectsByBlockHeight(Number(height)),
    queryFn: () =>
      !height
        ? Promise.resolve([])
        : TxEffectsAPI.getTxEffectsByBlockHeight(Number(height)),
  });
};

export const useGetTxEffectsByBlockHeightRange = (
  from: number | undefined,
  to: number | undefined
): UseQueryResult<(ChicmozL2TxEffectDeluxe | undefined)[], Error>[] => {
  return useQueries({
    queries:
      from === undefined || to === undefined
        ? []
        : new Array(to - from + 1).fill(0).map((_, i) => ({
            queryKey: queryKeyGenerator.txEffectsByBlockHeight(to - i),
            queryFn: () => TxEffectsAPI.getTxEffectsByBlockHeight(to - i),
          })),
  });
};
