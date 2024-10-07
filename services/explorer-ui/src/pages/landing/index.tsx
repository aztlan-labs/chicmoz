import { FC } from "react";
import { BlocksTable } from "~/components/blocks/blocks-table";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { useLatestBlocks } from "~/hooks";
import {
  useAvarageBlockTime,
  useAvarageFees,
  useTotalContracts,
  useTotalTxEffects,
  useTotalTxEffectsLast24h,
} from "~/hooks/stats";
import { mapLatestBlocks, mapLatestTxEffects } from "./util";

export const Landing: FC = () => {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();
  const {
    data: totalTxEffects,
    isLoading: loadingTotalEffects,
    error: errorTotalEffects,
  } = useTotalTxEffects();
  const {
    data: totalTxEffects24h,
    isLoading: loadingTotalEffects24h,
    error: errorTotalEffects24h,
  } = useTotalTxEffectsLast24h();
  const {
    data: avarageFees,
    isLoading: loadingAvarageFees,
    error: errorAvarageFees,
  } = useAvarageFees();
  const {
    data: totalAmountOfContracts,
    isLoading: loadingAmountContracts,
    error: errorAmountContracts,
  } = useTotalContracts();
  const {
    data: avarageBlockTime,
    isLoading: loadingAvarageBlockTime,
    error: errorAvarageBlockTime,
  } = useAvarageBlockTime();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;

  const getStatsData = (
    isLoading: boolean,
    error: Error | null,
    data?: string,
  ) => {
    let text;
    if (!data) text = "No Data";
    if (isLoading) text = "Loading";
    if (error) text = error.message;
    if (data) text = data;

    return <h2 className="text-primary">{text}</h2>;
  };

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-row flex-wrap justify-center gap-2 m-8">
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Total Blocks</p>
          {getStatsData(
            loadingTotalEffects,
            errorTotalEffects,
            totalTxEffects,
          )}
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>TX-Effects last 24 hours </p>
          {getStatsData(
            loadingTotalEffects24h,
            errorTotalEffects24h,
            totalTxEffects24h,
          )}
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Total amount of contracts</p>
          {getStatsData(
            loadingAmountContracts,
            errorAmountContracts,
            totalAmountOfContracts,
          )}
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Average fee's</p>
          {getStatsData(loadingAvarageFees, errorAvarageFees, avarageFees)}
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Average block time</p>
          {getStatsData(
            loadingAvarageBlockTime,
            errorAvarageBlockTime,
            avarageBlockTime,
          )}
        </div>
        <div className="bg-white w-3/12 rounded-lg shadow-md p-4">
          <p>Todo</p>
          <h2 className="text-primary">TODO</h2>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
          <h2>Latest Blocks</h2>
          <BlocksTable blocks={mapLatestBlocks(latestBlocks)} />
        </div>

        <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
          <h2>Latest TX-Effects</h2>
          <TxEffectsTable txEffects={mapLatestTxEffects(latestBlocks)} />
        </div>
      </div>
    </div>
  );
};
