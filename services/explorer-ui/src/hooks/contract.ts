import {
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeluxe,
} from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { ContractL2API } from "~/api";
import { REFETCH_INTERVAL, queryKeyGenerator } from "./utils";

export const useContractClasses = (
  classId?: string
): UseQueryResult<ChicmozL2ContractClassRegisteredEvent[], Error> => {
  return useQuery<ChicmozL2ContractClassRegisteredEvent[], Error>({
    queryKey: queryKeyGenerator.contractClass(classId),
    queryFn: () => ContractL2API.getContractClasses(classId),
  });
};

export const useLatestContractClasses = (
  classId?: string
): UseQueryResult<ChicmozL2ContractClassRegisteredEvent[], Error> => {
  return useQuery<ChicmozL2ContractClassRegisteredEvent[], Error>({
    queryKey: queryKeyGenerator.latestContractClasses(classId),
    queryFn: () => ContractL2API.getContractClasses(classId),
    refetchInterval: REFETCH_INTERVAL,
  });
};

export const useContractInstance = (
  address: string
): UseQueryResult<ChicmozL2ContractInstanceDeluxe, Error> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe, Error>({
    queryKey: queryKeyGenerator.contractInstance(address),
    queryFn: () => ContractL2API.getContractInstance(address),
  });
};

export const useLatestContractInstances = (): UseQueryResult<
  ChicmozL2ContractInstanceDeluxe[],
  Error
> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe[], Error>({
    queryKey: queryKeyGenerator.latestContractInstances,
    queryFn: () => ContractL2API.getContractInstances(),
  });
};

export const useDeployedContractInstances = (
  classId: string
): UseQueryResult<ChicmozL2ContractInstanceDeluxe[], Error> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe[], Error>({
    queryKey: queryKeyGenerator.deployedContractInstances(classId),
    queryFn: () => ContractL2API.getContractInstancesByClassId(classId),
  });
};
