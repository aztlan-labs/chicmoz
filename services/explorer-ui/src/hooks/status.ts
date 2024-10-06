import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { statusL2Api } from "~/api/status";

export const useTotalTxEffects = (): UseQueryResult<string, Error> => {
  return useQuery<string, Error>({
    queryKey: ["useTotalTxEffects"],
    queryFn: statusL2Api.getL2TotalTxEffects,
  });
};

export const useTotalTxEffectsLast24h = (): UseQueryResult<string, Error> => {
  return useQuery<string, Error>({
    queryKey: ["useTotalTxEffectsLast24h"],
    queryFn: statusL2Api.getL2TotalTxEffectsLast24h,
  });
};

export const useTotalContracts = (): UseQueryResult<string, Error> => {
  return useQuery<string, Error>({
    queryKey: ["useTotalContracts"],
    queryFn: statusL2Api.getL2TotalTxEffectsLast24h,
  });
};

export const useAvarageFees = (): UseQueryResult<string, Error> => {
  return useQuery<string, Error>({
    queryKey: ["useAvarageFees"],
    queryFn: statusL2Api.getL2AverageFees,
  });
};

export const useAvarageBlockTime = (): UseQueryResult<string, Error> => {
  return useQuery<string, Error>({
    queryKey: ["useAvarageBlockTime"],
    queryFn: statusL2Api.getL2AverageBlockTime,
  });
};
