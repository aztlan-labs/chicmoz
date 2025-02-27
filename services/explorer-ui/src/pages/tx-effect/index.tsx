import { type FC } from "react";
import { InfoBadge } from "~/components/info-badge";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import {
  useGetTxEffectsByBlockHeightRange,
  useLatestBlocks,
  useSubTitle,
  useTotalTxEffects,
  useTotalTxEffectsLast24h,
} from "~/hooks";
import { routes } from "~/routes/__root";
import { parseTxEffectsData } from "../landing/util";

export const TxEffects: FC = () => {
  useSubTitle(routes.txEffects.children.index.title);
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

  const latestTxEffectsData = useGetTxEffectsByBlockHeightRange(
    latestBlocks?.at(-1)?.height,
    latestBlocks?.at(0)?.height
  );
  const {
    isLoadingTxEffects,
    txEffectsErrorMsg: txEffectsError,
    latestTxEffects,
  } = parseTxEffectsData(latestTxEffectsData, latestBlocks);

  return (
    <div className="mx-auto px-5 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-wrap m-5">
        <h2 className="mt-2 text-primary md:hidden">All Tx Effects</h2>
        <h1 className="hidden md:block md:mt-8">All Tx Effects</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 my-10 md:gap-5 ">
        <InfoBadge
          title="Total transactions"
          isLoading={loadingTotalEffects}
          error={errorTotalEffects}
          data={totalTxEffects}
        />
        <InfoBadge
          title="Total transactions last 24h"
          isLoading={loadingTotalEffects24h}
          error={errorTotalEffects24h}
          data={totalTxEffects24h}
        />
      </div>
      <div className="rounded-lg shadow-lg">
        <TxEffectsTable
          txEffects={latestTxEffects}
          isLoading={isLoading || isLoadingTxEffects}
          error={error ?? txEffectsError}
        />
      </div>
    </div>
  );
};
