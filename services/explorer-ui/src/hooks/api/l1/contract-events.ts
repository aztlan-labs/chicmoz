import { type ChicmozL1GenericContractEvent } from "@chicmoz-pkg/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { ContractEventAPI } from "~/api/l1/contract-events";
import { queryKeyGenerator } from "../utils";

export const useContractEvents = (): UseQueryResult<
  ChicmozL1GenericContractEvent[],
  Error
> => {
  return useQuery<ChicmozL1GenericContractEvent[], Error>({
    queryKey: queryKeyGenerator.l1ContractEvents,
    queryFn: () => ContractEventAPI.getContractEvents(),
  });
};
