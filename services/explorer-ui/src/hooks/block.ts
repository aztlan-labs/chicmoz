import { type ChicmozL2Block } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { BlockAPI } from "~/api";

export const useLatestBlock = (): UseQueryResult<ChicmozL2Block, Error> => {
  return useQuery<ChicmozL2Block, Error>({
    queryKey: ["latestBlock"],
    queryFn: BlockAPI.getLatestBlock,
  });
};