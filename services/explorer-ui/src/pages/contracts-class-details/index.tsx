import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractClasses, useDeployedContractInstances } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getContractData } from "./util";
import { ContractClassesAndInstancesTable } from "~/components/contracts/class-and-instance-tables";

export const ContractClassDetails: FC = () => {
  const { id } = useParams({
    from: "/contracts/classes/$id",
  });
  const contractClassVersions = useContractClasses(id);
  const contractDeployedInstances = useDeployedContractInstances(id);

  if (!id) return <div>No classId</div>;
  if (contractClassVersions.isLoading) return <div>Loading...</div>;
  if (contractClassVersions.error) return <div>Error</div>;
  if (!contractClassVersions.data) return <div>No data</div>;

  const apiEndpointUrl = `${API_URL}/${aztecExplorer.getL2ContractClasses(id)}`;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2>Contract class details</h2>
            <a href={apiEndpointUrl} target="_blank" rel="noreferrer">
              (API Endpoint)
            </a>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay
                data={getContractData(contractClassVersions.data[0])}
              />
            </div>
          </div>
        </div>
        <ContractClassesAndInstancesTable
          classesTitle="Contract Class Versions"
          contractClassesData={contractClassVersions}
          instancesTitle="Deployed Instances"
          contractInstancesData={contractDeployedInstances}
        />
      </div>
    </div>
  );
};
