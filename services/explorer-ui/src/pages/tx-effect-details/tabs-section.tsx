import { FC, useState } from "react";
import { OptionButtons } from "~/components/option-buttons";
import { PrivateLogs } from "./tabs/private-logs";
import { PublicLogs } from "./tabs/public-logs";
import { GenericListDisplay } from "~/components/info-display/generic-list-display";
import { PublicDataWrites } from "./tabs/public-data-write";
import { Loader } from "~/components/loader";
import { ChicmozL2TxEffectDeluxe } from "@chicmoz-pkg/types";
import { mapTxEffectsData } from "./utils";
import { txEffectTabs, TabId } from "./types";

interface PillSectionProps {
  txEffects: ChicmozL2TxEffectDeluxe
}
export const TabsSection: FC<PillSectionProps> = ({
  txEffects,
}) => {
  const [selectedTab, setSelectedTab] = useState<TabId>("nullifiers");
  const onSelectChange = (value: string) => {
    setSelectedTab(value as TabId);
  };

  const txEffectData = mapTxEffectsData(txEffects);

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
    <>
      <OptionButtons
        options={txEffectTabs}
        availableOptions={txEffectData}
        onOptionSelect={onSelectChange}
        selectedItem={selectedTab}
      />
      <div className="bg-white rounded-lg shadow-md p-4">
        {renderTabContent()}
      </div>
    </>
  );
};
