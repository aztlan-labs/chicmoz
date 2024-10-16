import { FC } from "react";
import { InfoBadge } from "~/components/info-badge";
import { getTxEffectTableObj } from "~/components/tx-effects/tx-effects-schema";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { useLatestBlocks } from "~/hooks";
import { useTotalTxEffects, useTotalTxEffectsLast24h } from "~/hooks/stats";

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;

  const latestTxEffects = latestBlocks.flatMap((block) => {
    return block.body.txEffects.map((txEffect) =>
      getTxEffectTableObj(txEffect, block),
    );
  });

  return (
    <div className="mx-auto px-5 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-wrap justify-center gap-3 m-5 ">
        <h2 className="mt-2 text-primary md:hidden">All tx-effects</h2>
        <h1 className="hidden md:block md:mt-16">All tx-effects</h1>
      </div>
      <div className="flex flex-row justify-center gap-4 m-8">
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
      <TxEffectsTable txEffects={latestTxEffects} />
    </div>
  );
};
