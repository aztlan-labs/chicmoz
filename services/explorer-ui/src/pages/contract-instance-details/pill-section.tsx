import { FC, useState } from "react";
import { routes } from "~/routes/__root";
import { OptionButtons } from "~/components/option-buttons";
import {
  ContactDetailsData,
  TabId,
  VerifiedDeploymentData,
  verifiedDeploymentTabs,
} from "./types";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { Link } from "@tanstack/react-router";
import { CustomTooltip } from "~/components/custom-tooltip";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Loader } from "~/components/loader";

interface PillSectionProps {
  verifiedDeploymentData?: VerifiedDeploymentData;
  contactDetailsData?: ContactDetailsData;
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
              <h2 className="flex items-center gap-2">
                <div className="relative group">
                  <Link to={routes.verifiedContractInstances.route}>
                    <CustomTooltip content="Read more about verified contract instances here">
                      <CheckCircledIcon className="size-10 stroke-lime-700" />
                    </CustomTooltip>
                  </Link>
                </div>
                Verified deployment
              </h2>
              <div className="flex flex-col mt-2">
                <h3 className="text-primary">Deployer:</h3>
                <KeyValueDisplay data={verifiedDeploymentData.deployer.data} />
              </div>
              <div className="flex flex-col mt-2">
                {!verifiedDeploymentData && <Loader amount={1} />}
                <h3 className="text-primary">Salt:</h3>
                <KeyValueDisplay data={verifiedDeploymentData.salt.data} />
              </div>
              <div className="flex flex-col mt-2">
                <h3 className="text-primary">Public keys:</h3>
                <KeyValueDisplay
                  data={verifiedDeploymentData.publicKeys.data}
                />
              </div>
              <div className="flex flex-col mt-2">
                <h3 className="text-primary">Args:</h3>
                <KeyValueDisplay data={verifiedDeploymentData.args.data} />
              </div>
            </div>
          )}
          {selectedTab === "contactDetails" && (
            <div className="bg-white w-full rounded-lg">
              <div className="flex flex-col mt-2">
                <h4 className="text-primary">Creator name:</h4>
                <KeyValueDisplay data={contactDetailsData.creatorName.data} />
              </div>

              <div className="flex flex-col mt-2">
                <h5 className="text-primary">App website URL:</h5>
                <KeyValueDisplay data={contactDetailsData.appWebsiteUrl.data} />
              </div>
              <div className="flex flex-col mt-2">
                <h5 className="text-primary">Socials:</h5>
                <KeyValueDisplay data={contactDetailsData.externalUrls.data} />
              </div>
              <div className="flex flex-col mt-2">
                <h3 className="text-primary">Contact:</h3>
                <KeyValueDisplay data={contactDetailsData.contact.data} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
