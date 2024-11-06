import { type FC } from "react";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";
import { useLatestBlocks } from "~/hooks";
import { parseLatestBlocks } from "./util";
import { useAvarageBlockTime, useAvarageFees } from "~/hooks/stats";
import { formatDuration } from "~/lib/utils";
import { InfoBadge } from "~/components/info-badge";

export const Blocks: FC = () => {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();
  const {
    data: avarageFees,
    isLoading: loadingAvarageFees,
    error: errorAvarageFees,
  } = useAvarageFees();
  const {
    data: avarageBlockTime,
    isLoading: loadingAvarageBlockTime,
    error: errorAvarageBlockTime,
  } = useAvarageBlockTime();

  const averageBlockTimeFormatted = formatDuration(
    Number(avarageBlockTime) / 1000
  );

  return (
    <div className="mx-auto px-5 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-wrap justify-center gap-3 m-5 ">
        <h2 className="mt-2 text-primary md:hidden">Blocks</h2>
        <h1 className="hidden md:block md:mt-16">Blocks</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5 mb-5 md:gap-5 ">
        <InfoBadge
          title="Average fees (FPA)"
          isLoading={loadingAvarageFees}
          error={errorAvarageFees}
          data={avarageFees}
        />
        <InfoBadge
          title="Average block time"
          isLoading={loadingAvarageBlockTime}
          error={errorAvarageBlockTime}
          data={averageBlockTimeFormatted}
        />
      </div>
      <div className="rounded-lg shadow-lg">
        <BlocksTable
          blocks={parseLatestBlocks(latestBlocks)}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
