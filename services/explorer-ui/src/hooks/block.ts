import { type ChicmozL2BlockLight } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { BlockAPI } from "~/api";
import { queryKeyGenerator } from "./utils";

export const useLatestBlock = (): UseQueryResult<
  ChicmozL2BlockLight,
  Error
> => {
  return useQuery<ChicmozL2BlockLight, Error>({
    queryKey: queryKeyGenerator.latestBlock,
    queryFn: BlockAPI.getLatestBlock,
  });
};

export const useGetBlockByHeight = (
  height: string
): UseQueryResult<ChicmozL2BlockLight, Error> => {
  return useQuery<ChicmozL2BlockLight, Error>({
    queryKey: queryKeyGenerator.blockByHeight(height),
    queryFn: () => BlockAPI.getBlockByHeight(height),
  });
};

export const useLatestBlocks = (): UseQueryResult<
  ChicmozL2BlockLight[],
  Error
> => {
  return useQuery<ChicmozL2BlockLight[], Error>({
    queryKey: queryKeyGenerator.latestBlocks,
    queryFn: () => BlockAPI.getBlocksByHeightRange(),
  });
};
