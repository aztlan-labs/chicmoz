import { type ChicmozL2Sequencer } from "@chicmoz-pkg/types";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { SequencerAPI } from "~/api";
import { queryKeyGenerator } from "./utils";

export const useSequencers = (): UseQueryResult<
  ChicmozL2Sequencer[],
  Error
> => {
  return useQuery<ChicmozL2Sequencer[], Error>({
    queryKey: queryKeyGenerator.sequencers,
    queryFn: () => SequencerAPI.getAllSequencers(),
  });
};

export const useSequencer = (
  enr: string
): UseQueryResult<ChicmozL2Sequencer, Error> => {
  return useQuery<ChicmozL2Sequencer, Error>({
    queryKey: queryKeyGenerator.sequencer(enr),
    queryFn: () => SequencerAPI.getSequencerByEnr(enr),
  });
};
