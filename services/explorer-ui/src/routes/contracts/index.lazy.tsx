import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { contractClassSchema } from "~/components/contracts/classes/schema";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { contractInstanceSchema } from "~/components/contracts/instances/schema";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { useLatestContractClasses, useLatestContractInstances } from "~/hooks";

export const Route = createLazyFileRoute("/contracts/")({
  component: TxEffects,
});

function TxEffects() {
  const {
    data: latestContractClassesData,
    isLoading: isLoadingClasses,
    error: errorClasses,
  } = useLatestContractClasses();
  const latestContractClasses = latestContractClassesData?.map(
    (contractClass) =>
      contractClassSchema.parse({
        blockHash: contractClass.blockHash,
        contractClassId: contractClass.contractClassId,
        version: contractClass.version,
        artifactHash: contractClass.artifactHash,
        privateFunctionsRoot: contractClass.privateFunctionsRoot,
      })
  );
  const {
    data: latestContractInstancesData,
    isLoading: isLoadingInstances,
    error: errorInstances,
  } = useLatestContractInstances();
  const latestContractInstances = latestContractInstancesData?.map(
    (contractInstance) =>
      contractInstanceSchema.parse({
        address: contractInstance.address,
        blockHash: contractInstance.blockHash,
        blockHeight: contractInstance.blockHeight,
        version: contractInstance.version,
        contractClassId: contractInstance.contractClassId,
        publicKeysHash: contractInstance.publicKeysHash,
        deployer: contractInstance.deployer,
      })
  );
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
        <div className="flex flex-row gap-4">
          <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
            <h2>Latest Contract Classes</h2>
            {isLoadingClasses ? (
              <p>Loading...</p>
            ) : errorClasses ? (
              <p className="text-red-500">{errorClasses.message}</p>
            ) : !latestContractClasses ? (
              <p>No data</p>
            ) : (
              <ContractClassesTable contracts={latestContractClasses} />
            )}
          </div>
          <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
            <h2>Latest Contract Instances</h2>
            {isLoadingInstances ? (
              <p>Loading...</p>
            ) : errorInstances ? (
              <p className="text-red-500">{errorInstances.message}</p>
            ) : !latestContractInstances ? (
              <p>No data</p>
            ) : (
              <ContractInstancesTable contracts={latestContractInstances} />
            )}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
