import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useGetTxEffectByHash, useSubTitle } from "~/hooks";
import { getTxEffectData } from "./utils";
import { TabsSection } from "./tabs-section";

export const TxEffectDetails: FC = () => {
  const { hash } = useParams({
    from: "/tx-effects/$hash",
  });
  useSubTitle(`TxEff ${hash}`);
  const { data: txEffects, isLoading, error } = useGetTxEffectByHash(hash);


  if (!hash) <div> No txEffect hash</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  if (!txEffects) return <div>No data</div>;


  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div className="flex flex-wrap m-3">
          <h3 className="text-primary md:hidden">Tx Effects Details</h3>
          <h2 className="hidden md:block md:mt-8 md:text-primary">Tx Effects Details</h2>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getTxEffectData(txEffects)} />
          </div>
          <TabsSection txEffects={txEffects} />
        </div>
      </div>
    </div>
  );
};
