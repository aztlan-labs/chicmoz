import { FC } from "react";
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;
  const averageBlockTimeFormatted = formatDuration(
    Number(avarageBlockTime) / 1000
  );

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">Latest Blocks</h1>
      <div className="flex flex-row justify-center gap-4 m-8">
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
      <BlocksTable blocks={parseLatestBlocks(latestBlocks)} />
    </div>
  );
};
