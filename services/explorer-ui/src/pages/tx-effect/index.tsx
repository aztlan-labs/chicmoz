import { type FC } from "react";
import { InfoBadge } from "~/components/info-badge";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { useLatestBlocks } from "~/hooks";
import { useTotalTxEffects, useTotalTxEffectsLast24h } from "~/hooks/stats";
import { useGetTxEffectsByBlockHeightRange } from "~/hooks/tx-effect";
import { parseTxEffectsData } from "../landing/util";

export const TxEffects: FC = () => {
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
      <div className="flex flex-wrap justify-center m-5">
        <h2 className="mt-2 text-primary md:hidden">All Tx Effects</h2>
        <h1 className="hidden md:block md:mt-16">All Tx Effects</h1>
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
