import { FC } from "react";
import { InfoBadge } from "~/components/info-badge";
import { useLatestContractClasses, useLatestContractInstances } from "~/hooks";
import { useTotalContracts, useTotalContractsLast24h } from "~/hooks/stats";
import { mapContractClasses, mapContractInstances } from "./util";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { TableBadge } from "~/components/table-badge";

export const Contracts: FC = () => {
  const {
    data: classesData,
    isLoading: isLoadingClasses,
    error: errorClasses,
  } = useLatestContractClasses();
  const {
    data: instancesData,
    isLoading: isLoadingInstances,
    error: errorInstances,
  } = useLatestContractInstances();
  const {
    data: totalAmountOfContracts,
    isLoading: loadingAmountContracts,
    error: errorAmountContracts,
  } = useTotalContracts();
  const {
    data: totalAmountOfContracts24h,
    isLoading: loadingAmountContracts24h,
    error: errorAmountContracts24h,
  } = useTotalContractsLast24h();

  return (
    <div className="mx-auto px-7 max-w-[1440px] md:px-[70px]">
      <div className="flex flex-wrap justify-center gap-3 m-5 ">
        <h2 className="mt-2 text-primary md:hidden">All contracts</h2>
        <h1 className="hidden md:block md:mt-16">All contracts</h1>
      </div>
      <div className="flex flex-row justify-center gap-4 m-8">
        <InfoBadge
          title="Total Contract Classes"
          isLoading={loadingAmountContracts}
          error={errorAmountContracts}
          data={totalAmountOfContracts}
        />
        <InfoBadge
          title="Total Contract Classes last 24h"
          isLoading={loadingAmountContracts24h}
          error={errorAmountContracts24h}
          data={totalAmountOfContracts24h}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row ">
        <TableBadge
          title="Total Contract classes"
          isLoading={isLoadingClasses}
          error={errorClasses}
        >
          {classesData && (
            <ContractClassesTable contracts={mapContractClasses(classesData)} />
          )}
        </TableBadge>

        <TableBadge
          title="Total Contract Instances"
          isLoading={isLoadingInstances}
          error={errorInstances}
        >
          {instancesData && (
            <ContractInstancesTable
              contracts={mapContractInstances(instancesData)}
            />
          )}
        </TableBadge>
      </div>
    </div>
  );
};
