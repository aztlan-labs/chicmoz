import { type ChicmozFeeRecipient } from "@chicmoz-pkg/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { FeeRecipientAPI } from "~/api/fee-recipient";
import { queryKeyGenerator } from "./utils";

export const useFeeRecipients = (): UseQueryResult<
  ChicmozFeeRecipient[],
  Error
> => {
  return useQuery<ChicmozFeeRecipient[], Error>({
    queryKey: queryKeyGenerator.feeRecipients,
    queryFn: () => FeeRecipientAPI.getFeeRecipients(),
  });
};
