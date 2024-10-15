import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { ContractClassesAndInstancesTable } from "~/components/contracts/class-and-instance-tables";
import { contractClassSchema } from "~/components/contracts/classes/schema";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { contractInstanceSchema } from "~/components/contracts/instances/schema";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { useLatestContractClasses, useLatestContractInstances } from "~/hooks";

export const Route = createLazyFileRoute("/contracts/")({
  component: TxEffects,
});

function TxEffects() {
  const latestClassesData = useLatestContractClasses();
  const latestInstancesData = useLatestContractInstances();

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
    title: isIndex ? "All Contract Instances" : "Contract Instance Details",
  };
  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <h1 className="mt-16">{text.title}</h1>
      {isIndex ? (
        <ContractClassesAndInstancesTable
          classesTitle="Latest Contract Classes"
          contractClassesData={latestClassesData}
          instancesTitle="Latest Contract Instances"
          contractInstancesData={latestInstancesData}
        />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
