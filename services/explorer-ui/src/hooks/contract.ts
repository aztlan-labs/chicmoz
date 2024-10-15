import {
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeluxe,
} from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { ContractL2API } from "~/api";

export const useContractClasses = (
  classId?: string,
): UseQueryResult<ChicmozL2ContractClassRegisteredEvent[], Error> => {
  return useQuery<ChicmozL2ContractClassRegisteredEvent[], Error>({
    queryKey: ["contractClass", classId],
    queryFn: () => ContractL2API.getContractClasses(classId),
  });
};

export const useLatestContractClasses = (
  address?: string,
): UseQueryResult<ChicmozL2ContractClassRegisteredEvent[], Error> => {
  return useQuery<ChicmozL2ContractClassRegisteredEvent[], Error>({
    queryKey: ["latestContractClasses", address],
    queryFn: () => ContractL2API.getContractClasses(address),
  });
};

export const useContractInstance = (
  address: string,
): UseQueryResult<ChicmozL2ContractInstanceDeluxe, Error> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe, Error>({
    queryKey: ["contractInstance", address],
    queryFn: () => ContractL2API.getContractInstance(address),
  });
};

export const useLatestContractInstances = (
  classId?: string,
): UseQueryResult<ChicmozL2ContractInstanceDeluxe[], Error> => {
  return useQuery<ChicmozL2ContractInstanceDeluxe[], Error>({
    queryKey: ["latestContractInstances"],
    queryFn: () => classId ? ContractL2API.getContractInstancesByClassId(classId) : ContractL2API.getContractInstances(),
  });
}
