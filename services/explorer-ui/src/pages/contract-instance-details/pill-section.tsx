import { FC, useState } from "react";
import { OptionButtons } from "~/components/option-buttons";
import {
  TabId,
  verifiedDeploymentTabs,
} from "./types";
import { DetailItem, KeyValueDisplay } from "~/components/info-display/key-value-display";
import { Loader } from "~/components/loader";

interface PillSectionProps {
  verifiedDeploymentData?: DetailItem[];
  contactDetailsData?: DetailItem[];
}
export const PillSection: FC<PillSectionProps> = ({
  verifiedDeploymentData,
  contactDetailsData,
}) => {
  const [selectedTab, setSelectedTab] = useState<TabId>("verifiedDeployment");
  const onOptionSelect = (value: string) => {
    setSelectedTab(value as TabId);
  };

  const isAvailable = {
    verifiedDeployment: !!verifiedDeploymentData,
    contactDetails: !!contactDetailsData,
  };
  if (!verifiedDeploymentData || !contactDetailsData)
    return <Loader amount={1} />;

  return (
    <>
      <OptionButtons
        options={verifiedDeploymentTabs}
        availableOptions={isAvailable}
        onOptionSelect={onOptionSelect}
        selectedItem={selectedTab}
      />
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col gap-4 md:flex-row ">
          {selectedTab === "verifiedDeployment" && (
            <div className="bg-white w-full rounded-lg">
              <KeyValueDisplay data={verifiedDeploymentData} />
            </div >
          )}
          {
            selectedTab === "contactDetails" && (
              <div className="bg-white w-full rounded-lg">
                <KeyValueDisplay data={contactDetailsData} />
              </div >
            )
          }
        </div >
      </div >
    </>
  );
};
