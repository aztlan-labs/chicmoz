import { type ChicmozL2VerifiedContractInctanceData } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { VerifiedContractInstanceL2API } from "~/api";
import { queryKeyGenerator } from "./utils";

export const useVerifiedContractInstances = (): UseQueryResult<
  ChicmozL2VerifiedContractInctanceData[],
  Error
> => {
  return useQuery<ChicmozL2VerifiedContractInctanceData[], Error>({
    queryKey: queryKeyGenerator.verifiedContracts,
    queryFn: VerifiedContractInstanceL2API.getVerifiedContracts,
  });
};
