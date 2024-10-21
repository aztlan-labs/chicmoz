import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractClasses, useContractInstance } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getContractData } from "./util";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { mapContractClasses, mapContractInstances } from "../contract/util";
import { TableBadge } from "~/components/table-badge";
import { ContractClassesTable } from "~/components/contracts/classes/table";

export const ContractClassDetails: FC = () => {
  const { id } = useParams({
    from: "/contracts/classes/$id",
  });
  const {
    data: classesData,
    isLoading: isLoadingClasses,
    error: errorClasses,
  } = useContractClasses(id);
  const {
    data: instancesData,
    isLoading: isLoadingInstances,
    error: errorInstances,
  } = useContractInstance(id);

  if (!id) return <div>No classId</div>;

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
                data={classesData ? getContractData(classesData[0]) : []}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row ">
          <TableBadge
            title="Versions"
            isLoading={isLoadingClasses}
            error={errorClasses}
          >
            {classesData && (
              <ContractClassesTable
                contracts={mapContractClasses(classesData)}
              />
            )}
          </TableBadge>

          <TableBadge
            title="Total Contract Instances"
            isLoading={isLoadingInstances}
            error={errorInstances}
          >
            {instancesData && (
              <ContractInstancesTable
                contracts={mapContractInstances([instancesData])}
              />
            )}
          </TableBadge>
        </div>
      </div>
    </div>
  );
};
