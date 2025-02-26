import { useParams } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { OptionButtons } from "~/components/option-buttons";
import { TxEffectsTable } from "~/components/tx-effects/tx-effects-table";
import {
  useGetBlockByIdentifier,
  useGetTxEffectsByBlockHeight,
  useSubTitle,
} from "~/hooks";
import { blockDetailsTabs, type TabId } from "./constants";
import { getBlockDetails, getTxEffects } from "./util";

export const BlockDetails: FC = () => {
  const { blockNumber } = useParams({
    from: "/blocks/$blockNumber",
  });
  useSubTitle(`Block ${blockNumber}`);
  const [selectedTab, setSelectedTab] = useState<TabId>("txEffects");
  const onOptionSelect = (value: string) => {
    setSelectedTab(value as TabId);
  };
  const {
    data: latestBlock,
    isLoading,
    error,
  } = useGetBlockByIdentifier(blockNumber);

  const height = latestBlock?.height;
  const {
    data: blockTxEffects,
    isLoading: txEffectsLoading,
    error: txEffectsError,
  } = useGetTxEffectsByBlockHeight(height);

  if (!latestBlock) return <div> No block hash</div>;


  const renderTabContent = () => {
    switch (selectedTab) {
      case "txEffects":
        const isTxLoading = isLoading || txEffectsLoading || blockTxEffects?.length !== latestBlock.body?.txEffects?.length;
        return <TxEffectsTable txEffects={getTxEffects(blockTxEffects, latestBlock)} isLoading={isTxLoading} error={error ?? txEffectsError} />
      case "contracts":
        //TODO:Implement contract in a block
        return null
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div>
          <h2>Block Details </h2>
        </div>
        <div className="flex flex-col gap-4 mt-8 pb-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getBlockDetails(latestBlock)} />
          </div>
        </div>
        <OptionButtons
          options={blockDetailsTabs}
          availableOptions={{
            txEffects: !!blockTxEffects,
            contracts: false, // TODO
          }}
          onOptionSelect={onOptionSelect}
          selectedItem={selectedTab}
        />
        <div className="bg-white rounded-lg shadow-md p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
