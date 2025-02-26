import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractInstance, useSubTitle } from "~/hooks";
import {
  getContractData,
  tempVerifiedContractInstanceData,
} from "./util";
import { TabsSection } from "./tabs-section";

export const ContractInstanceDetails: FC = () => {
  const { address } = useParams({
    from: "/contracts/instances/$address",
  });
  useSubTitle(`Ctrct inst ${address}`);
  const {
    data: contractInstanceDetails,
    isLoading,
    error,
  } = useContractInstance(address);

  if (!address) <div> No contract address</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!contractInstanceDetails) return <div>No data</div>;

  // const verfiedData = getVerifiedContractInstanceData(contractInstanceDetails);
  const verfiedData = tempVerifiedContractInstanceData();

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2 className="flex items-center gap-2">
              Contract instance details
            </h2>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay
                data={getContractData(contractInstanceDetails)}
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <TabsSection
            verifiedDeploymentData={verfiedData.contractDetails}
            contactDetailsData={verfiedData.DeployerDetails}
          />
        </div>
      </div>
    </div>
  );
};
