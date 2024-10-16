import { ContractClassesTable } from "./classes/table";
import { ContractInstancesTable } from "./instances/table";
import { useContractClasses, useLatestContractInstances } from "~/hooks";
import { contractClassSchema } from "./classes/schema";
import { contractInstanceSchema } from "./instances/schema";

export const ContractClassesAndInstancesTable = ({
  classesTitle,
  contractClassesData,
  instancesTitle,
  contractInstancesData,
}: {
  classesTitle: string;
  contractClassesData: ReturnType<typeof useContractClasses>;
  instancesTitle: string;
  contractInstancesData: ReturnType<typeof useLatestContractInstances>;
}) => {
  const {
    data: classesData,
    isLoading: isLoadingClasses,
    error: errorClasses,
  } = contractClassesData;
  const {
    data: instancesData,
    isLoading: isLoadingInstances,
    error: errorInstances,
  } = contractInstancesData;

  const contractClasses = classesData?.map((contractClass) =>
    contractClassSchema.parse({
      blockHash: contractClass.blockHash,
      contractClassId: contractClass.contractClassId,
      version: contractClass.version,
      artifactHash: contractClass.artifactHash,
      privateFunctionsRoot: contractClass.privateFunctionsRoot,
    })
  );

  const contractInstances = instancesData?.map((contractInstance) =>
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

  return (
    <div className="flex flex-row gap-4">
      <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
        <h2>{classesTitle}</h2>
        {isLoadingClasses ? (
          <p>Loading...</p>
        ) : errorClasses ? (
          <p className="text-red-500">{errorClasses.message}</p>
        ) : !contractClasses ? (
          <p>No data</p>
        ) : (
          <ContractClassesTable contracts={contractClasses} />
        )}
      </div>
      <div className="bg-white w-1/2 rounded-lg shadow-md p-4">
        <h2>{instancesTitle}</h2>
        {isLoadingInstances ? (
          <p>Loading...</p>
        ) : errorInstances ? (
          <p className="text-red-500">{errorInstances.message}</p>
        ) : !contractInstances ? (
          <p>No data</p>
        ) : (
          <ContractInstancesTable contracts={contractInstances} />
        )}
      </div>
    </div>
  );
};
