import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { ContractClassesAndInstancesTable } from "~/components/contracts/class-and-instance-tables";
import { InfoBadge } from "~/components/info-badge";
import { useLatestContractClasses, useLatestContractInstances } from "~/hooks";
import { useTotalContracts, useTotalContractsLast24h } from "~/hooks/stats";

export const Route = createLazyFileRoute("/contracts/")({
  component: TxEffects,
});

function TxEffects() {
  const latestClassesData = useLatestContractClasses();
  const latestInstancesData = useLatestContractInstances();
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

  let isAddress = false;
  let isClass = false;
  let isIndex = false;
  try {
    useParams({ from: "/contracts/instances/$address" });
    isAddress = true;
  } catch (e) {
    // TODO
  }
  try {
    useParams({ from: "/contracts/classes/$id" });
    isClass = true;
  } catch (e) {
    // TODO
  }
  isIndex = !isAddress && !isClass;

  const text = {
    title: isIndex
      ? "All Contracts"
      : isClass
        ? "Contract Class Details"
        : "Contract Instance Details",
  };
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      {isIndex ? (
        <>
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

          <ContractClassesAndInstancesTable
            classesTitle="Latest Contract Classes"
            contractClassesData={latestClassesData}
            instancesTitle="Latest Contract Instances"
            contractInstancesData={latestInstancesData}
          />
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
