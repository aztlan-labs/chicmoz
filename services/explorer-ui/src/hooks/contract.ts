import { ChicmozL2ContractInstanceDeluxe } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { ContractL2API } from "~/api";

export const useContractInstance = (
  address: string,
): UseQueryResult<ChicmozL2ContractInstanceDeluxe, Error> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe, Error>({
    queryKey: ["contractInstance", address],
    queryFn: () => ContractL2API.getContracInstance(address),
  });
};

export const useLatestContractInstances = (): UseQueryResult<ChicmozL2ContractInstanceDeluxe[], Error> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe[], Error>({
    queryKey: ["latestContractInstances"],
    queryFn: () => ContractL2API.getContractInstances(),
  });
}
