import { FC, useState } from "react";
import { OptionButtons } from "~/components/option-buttons";
import { ChicmozL2ContractClassRegisteredEvent, ChicmozL2ContractInstanceDeluxe, } from "@chicmoz-pkg/types";
import { contractClassTabs, TabId } from "./constants";
import { getArtifactData } from "./util";
import { ContractInstancesTab } from "./tabs/contract-instances";
import { UseQueryResult } from "@tanstack/react-query";
import { ContractVersionsTab } from "./tabs/contract-versions";
import { JsonTab } from "./tabs/json-tab";

interface TabSectionProps {
  contractInstances: UseQueryResult<ChicmozL2ContractInstanceDeluxe[], Error>
  contractClasses: UseQueryResult<ChicmozL2ContractClassRegisteredEvent[], Error>
  selectedVersion: UseQueryResult<ChicmozL2ContractClassRegisteredEvent[], Error>
}

export const TabSection: FC<TabSectionProps> = ({ contractClasses, contractInstances, selectedVersion }) => {
  const [selectedTab, setSelectedTab] = useState<TabId>("contractVersions");
  const onOptionSelect = (value: string) => {
    setSelectedTab(value as TabId);
  };

  const { artifact, privFunc, uncFunc, pubFunc } = getArtifactData(selectedVersion.data);

  const isOptionAvailable = {
    contractVersions: !!contractClasses && !!contractClasses.data?.length,
    contractInstances: !!contractInstances && !!contractInstances.data?.length,

    privateFunctions: !!selectedVersion && privFunc && Object.values(privFunc).length > 1,
    unconstrainedFunctions: !!selectedVersion && uncFunc && Object.values(uncFunc).length > 1,
    publicFunctions: !!selectedVersion && pubFunc && Object.values(pubFunc).length > 1,
    artifactJson: !!selectedVersion && !!selectedVersion.artifactJson,
    functionJson: !!selectedVersion && !!selectedVersion.artifactJson
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "contractVersions":
        return <ContractVersionsTab data={contractClasses} />
      case "contractInstances":
        return <ContractInstancesTab data={contractInstances} />
      case "privateFunctions":
        return <JsonTab data={privFunc} />
      case "unconstrainedFunctions":
        return <JsonTab data={uncFunc} />
      case "publicFunctions":
        return <JsonTab data={pubFunc} />
      case "artifactJson":
        return <JsonTab data={artifact} />
      default:
        return null;
    }
  };
  return (<>

    <OptionButtons
      options={contractClassTabs}
      availableOptions={isOptionAvailable}
      onOptionSelect={onOptionSelect}
      selectedItem={selectedTab}
    />
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col gap-4 md:flex-row ">
        <div className="bg-white w-full rounded-lg">
          {renderTabContent()}
        </div>
      </div>
    </div>
  </>)
}
