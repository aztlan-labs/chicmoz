import { type ChicmozL2VerifiedContractAddressData } from "@chicmoz-pkg/types";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { VerifiedContractL2API } from "~/api";
import { queryKeyGenerator } from "./utils";

export const useVerifiedContracts = (): UseQueryResult<
  ChicmozL2VerifiedContractAddressData[],
  Error
> => {
  return useQuery<ChicmozL2VerifiedContractAddressData[], Error>({
    queryKey: queryKeyGenerator.verifiedContracts,
    queryFn: VerifiedContractL2API.getVerifiedContracts,
  });
};
