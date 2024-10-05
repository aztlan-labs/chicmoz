import { Outlet, createLazyFileRoute, useParams } from "@tanstack/react-router";
import { contractSchema } from "~/components/contracts/contract-schema";
import { ContractsTable } from "~/components/contracts/contract-table";
import { useLatestContractInstances } from "~/hooks";

export const Route = createLazyFileRoute("/contracts/")({
  component: TxEffects,
});

function TxEffects() {
  const {
    data,
    isLoading,
    error,
  } = useLatestContractInstances();
  const latestContractInstances = data?.map(
    (contractInstance) =>
      contractSchema.parse({
        address: contractInstance.address,
        blockHash: contractInstance.blockHash,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        blockHeight: contractInstance.blockHeight,
        version: contractInstance.version,
        contractClassId: contractInstance.contractClassId,
        publicKeysHash: contractInstance.publicKeysHash,
        deployer: contractInstance.deployer,
      })
  );
  let isIndex = true;
  try {
    const params = useParams({ from: "/contracts/$contractAddress" });
    isIndex = !params.contractAddress;
  } catch (e) {
    console.error(e);
    isIndex = true;
  }
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
        <ContractsTable contracts={latestContractInstances} />
      ) : (
        <Outlet />
      )}
    </div>
  );
}
