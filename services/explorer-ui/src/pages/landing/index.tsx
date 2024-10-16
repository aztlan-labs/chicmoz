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
import { InfoPil } from "~/components/info-pil";

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

  return (
    <div className="mx-auto px-5 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-row flex-wrap justify-center gap-3 m-5 ">
        <InfoPil
          title="Total TX-Effects"
          isLoading={loadingTotalEffects}
          error={errorTotalEffects}
          data={totalTxEffects}
        />
        <InfoPil
          title="Total TX-Effects last 24h"
          isLoading={loadingTotalEffects24h}
          error={errorTotalEffects24h}
          data={totalTxEffects24h}
        />
        <InfoPil
          title="Total Amount of Contracts"
          isLoading={loadingAmountContracts}
          error={errorAmountContracts}
          data={totalAmountOfContracts}
        />
        <InfoPil
          title="Average fees"
          isLoading={loadingAvarageFees}
          error={errorAvarageFees}
          data={avarageFees}
        />
        <InfoPil
          title="Average block time"
          isLoading={loadingAvarageBlockTime}
          error={errorAvarageBlockTime}
          data={avarageBlockTime}
        />
        <InfoPil title="TODO" isLoading={false} error={null} data="TODO" />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
          <h2>Latest Blocks</h2>
          <BlocksTable blocks={mapLatestBlocks(latestBlocks)} />
        </div>

        <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
          <h2>Latest TX-Effects</h2>
          <TxEffectsTable txEffects={mapLatestTxEffects(latestBlocks)} />
        </div>
      </div>
    </div>
  );
};
