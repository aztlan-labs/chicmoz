import { type ChicmozL2BlockLight } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { BlockAPI } from "~/api";

export const useLatestBlock = (): UseQueryResult<ChicmozL2BlockLight, Error> => {
  return useQuery<ChicmozL2BlockLight, Error>({
    queryKey: ["latestBlock"],
    queryFn: BlockAPI.getLatestBlock,
  });
};

export const useGetBlockByHeight = (
  height: string,
): UseQueryResult<ChicmozL2BlockLight, Error> => {
  return useQuery<ChicmozL2BlockLight, Error>({
    queryKey: ["blockByHeight", height],
    queryFn: () => BlockAPI.getBlockByHeight(height),
  });
};

export const useLatestBlocks = (): UseQueryResult<ChicmozL2BlockLight[], Error> => {
  return useQuery<ChicmozL2BlockLight[], Error>({
    queryKey: ["latestBlocks"],
    queryFn: () => BlockAPI.getBlocksByHeightRange(),
  });
}
