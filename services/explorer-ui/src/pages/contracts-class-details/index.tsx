import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { useContractClasses, useContractInstance } from "~/hooks";
import { API_URL, aztecExplorer } from "~/service/constants";
import { getContractData } from "./util";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { mapContractClasses, mapContractInstances } from "../contracts/util";

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
  if (!classesData) return <div>No data</div>;

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
              <KeyValueDisplay data={getContractData(classesData[0])} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row ">
          <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
            <h3>Contract classes</h3>
            {isLoadingClasses && <p>Loading...</p>}
            {errorClasses && (
              <p className="text-red-500">{errorClasses.message}</p>
            )}
            {!classesData && <p>No data</p>}
            {classesData && (
              <ContractClassesTable
                contracts={mapContractClasses(classesData)}
              />
            )}
          </div>
          <div className="bg-white w-full rounded-lg shadow-md p-4 md:w-1/2">
            <h3>Contract instances</h3>
            {isLoadingInstances && <p>Loading...</p>}
            {errorInstances && (
              <p className="text-red-500">{errorInstances.message}</p>
            )}
            {instancesData ? (
              <ContractInstancesTable
                contracts={mapContractInstances([instancesData])}
              />
            ) : (
              <p>No data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
