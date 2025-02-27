import { type FC } from "react";
import { BlocksTable } from "~/components/blocks/blocks-table.tsx";
import { InfoBadge } from "~/components/info-badge";
import {
  useAvarageBlockTime,
  useAvarageFees,
  useLatestBlocks,
  useSubTitle,
} from "~/hooks";
import { formatDuration } from "~/lib/utils";
import { routes } from "~/routes/__root";
import { parseLatestBlocks } from "./util";

export const Blocks: FC = () => {
  useSubTitle(routes.blocks.children.index.title);
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
      <div className="flex flex-wrap justify-center m-5">
        <h3 className="mt-2 text-primary md:hidden">All Blocks</h3>
        <h2 className="hidden md:block md:text-primary md:mt-16">All Blocks</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 my-10 md:gap-5 ">
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
