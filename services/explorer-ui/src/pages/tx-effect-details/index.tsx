import { useParams } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { OptionButtons } from "~/components/option-buttons";
import { useGetTxEffectByHash, useSubTitle } from "~/hooks";
import { txEffectTabs, type TabId } from "./constants";
import { getTxEffectData, mapTxEffectsData } from "./utils";
import { PrivateLogs } from "./private-logs";
import { PublicLogs } from "./public-logs";
import { GenericListDisplay } from "~/components/info-display/generic-list-display";
import { PublicDataWrites } from "./public-data-write";

export const TxEffectDetails: FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabId>("nullifiers");
  const { hash } = useParams({
    from: "/tx-effects/$hash",
  });
  useSubTitle(`TxEff ${hash}`);
  const { data: txEffects, isLoading, error } = useGetTxEffectByHash(hash);
  const txEffectData = mapTxEffectsData(txEffects);

  const onSelectChange = (value: string) => {
    setSelectedTab(value as TabId);
  };

  if (!hash) <div> No txEffect hash</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!txEffects || !selectedTab) return <div>No data</div>;

  const renderTabContent = () => {
    switch (selectedTab) {
      case "privateLogs":
        return <PrivateLogs logs={txEffects.privateLogs} />;
      case "publicLogs":
        return <PublicLogs logs={txEffects.publicLogs} />;
      case "nullifiers":
        return <GenericListDisplay title="Nullifiers" itemLabel="Nullifier" items={txEffects.nullifiers} />;
      case "noteHashes":
        return <GenericListDisplay title="Note hashes" itemLabel="Note hashes" items={txEffects.noteHashes} />;
      case "l2ToL1Msgs":
        return <GenericListDisplay title="L2 to L1 messages" itemLabel="L2 to L1 message" items={txEffects.l2ToL1Msgs} />;
      case "publicDataWrites":
        return <PublicDataWrites writes={txEffects.publicDataWrites} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div>
        <div>
          <h2>TxEffect details</h2>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <KeyValueDisplay data={getTxEffectData(txEffects)} />
          </div>
          <OptionButtons
            options={txEffectTabs}
            availableOptions={txEffectData}
            onOptionSelect={onSelectChange}
            selectedItem={selectedTab}
          />
          <div className="bg-white rounded-lg shadow-md p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
