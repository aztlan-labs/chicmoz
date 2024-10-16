import { createLazyFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { InfoPil } from "~/components/info-pil";
import { getTxEffectTableObj } from "~/components/tx-effects/tx-effects-schema";
||||||| 23e357b
import { InfoPil } from "~/components/info-pil";
import { txEffectSchema } from "~/components/tx-effects/tx-effects-schema";
=======
import { InfoBadge } from "~/components/info-badge";
import { txEffectSchema } from "~/components/tx-effects/tx-effects-schema";
>>>>>>> fabcc5e207c9c8f1b26fa1d82dc95504159e0202
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import { useLatestBlocks } from "~/hooks";

export const Route = createLazyFileRoute("/tx-effects/")({
  component: TxEffects,
});

function TxEffects() {
  const { data: latestBlocks, isLoading, error } = useLatestBlocks();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestBlocks) return <p>No data</p>;

  const latestTxEffects = latestBlocks.flatMap((block) => {
    return block.body.txEffects.map((txEffect) =>
      getTxEffectTableObj(txEffect, block)
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
          title="TxEffects in the last 24 hours"
          isLoading={false}
          error={null}
          data="TODO"
        />
        <InfoBadge
          title="TxEffects in the last hour"
          isLoading={false}
          error={null}
          data="TODO"
        />
      </div>
      <TxEffectsTable txEffects={latestTxEffects} />
    </div>
  );
}
