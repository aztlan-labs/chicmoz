import {
  type ChicmozChainInfo,
  type ChicmozL2RpcNodeError,
} from "@chicmoz-pkg/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ChainInfoAPI } from "~/api";
import { queryKeyGenerator } from "./utils";

export const useChainInfo = (): UseQueryResult<ChicmozChainInfo, Error> => {
  return useQuery<ChicmozChainInfo, Error>({
    queryKey: queryKeyGenerator.chainInfo,
    queryFn: () => ChainInfoAPI.getChainInfo(),
  });
};

export const useChainErrors = (): UseQueryResult<
  ChicmozL2RpcNodeError[],
  Error
> => {
  return useQuery<ChicmozL2RpcNodeError[], Error>({
    queryKey: queryKeyGenerator.chainErrors,
    queryFn: () =>
      ChainInfoAPI.getChainErrors().then((chainErrors) =>
        chainErrors.sort(
          (a, b) => b.lastSeenAt.getDate() - a.lastSeenAt.getDate()
        )
      ),
  });
};
