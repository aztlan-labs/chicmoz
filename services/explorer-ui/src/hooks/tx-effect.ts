import { type ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";
import {
  type UseQueryResult,
  useQuery,
  useQueries,
} from "@tanstack/react-query";
import { TxEffectsAPI } from "~/api";

export const useGetTxEffectByHash = (
  id: string
): UseQueryResult<ChicmozL2TxEffectDeluxe, Error> => {
  return useQuery<ChicmozL2TxEffectDeluxe, Error>({
    queryKey: ["txEffectByHash", id],
    queryFn: () => TxEffectsAPI.getTxEffectByHash(id),
  });
};

const generateTxEffectByBlockHeightKey = (height: number) => [
  "txEffectsByBlockHeight",
  height,
];

export const useGetTxEffectsByBlockHeight = (
  height: number
): UseQueryResult<ChicmozL2TxEffectDeluxe[], Error> => {
  return useQuery<ChicmozL2TxEffectDeluxe[], Error>({
    queryKey: generateTxEffectByBlockHeightKey(height),
    queryFn: () => TxEffectsAPI.getTxEffectsByBlockHeight(height),
  });
};

export const useGetTxEffectsByBlockHeightRange = (
  from: number | undefined,
  to: number | undefined
): UseQueryResult<ChicmozL2TxEffectDeluxe[], Error>[] => {
  return useQueries({
    queries:
      from === undefined || to === undefined
        ? []
        : new Array(to - from + 1).fill(0).map((_, i) => ({
            queryKey: generateTxEffectByBlockHeightKey(from + i),
            queryFn: () => TxEffectsAPI.getTxEffectsByBlockHeight(from + i),
          })),
  });
};
