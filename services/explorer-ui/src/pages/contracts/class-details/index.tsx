import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractClasses, useDeployedContractInstances } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getContractData } from "./util";
import { ContractClassesAndInstancesTable } from "~/components/contracts/class-and-instance-tables";

export const ContractClassDetails: FC = () => {
  let classId = "";
  try {
    const params = useParams({
      from: "/contracts/classes/$id",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    classId = params.id;
  } catch (e) {
    // TODO
  }
  const contractClassVersions = useContractClasses(classId);
  const contractDeployedInstances = useDeployedContractInstances(classId);

  if (!classId) return <div>No classId</div>;
  if (contractClassVersions.isLoading) return <div>Loading...</div>;
  if (contractClassVersions.error) return <div>Error</div>;
  if (!contractClassVersions.data) return <div>No data</div>;

  const apiEndpointUrl = `${API_URL}/${aztecExplorer.getL2ContractClasses(
    classId
  )}`;
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
