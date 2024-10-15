import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { contractInstancesSchema } from "~/components/contracts/instances/schema";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { useLatestContractInstances } from "~/hooks";

export const Route = createLazyFileRoute("/contracts/")({
  component: TxEffects,
});

function TxEffects() {
  const { data, isLoading, error } = useLatestContractInstances();
  const latestContractInstances = data?.map((contractInstance) =>
    contractInstancesSchema.parse({
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (!latestContractInstances) return <p>No data</p>;

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
            <ContractInstancesTable contracts={latestContractInstances} />
          </div>
          <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
            <h2>Latest Contract Instances</h2>
            <ContractInstancesTable contracts={latestContractInstances} />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
