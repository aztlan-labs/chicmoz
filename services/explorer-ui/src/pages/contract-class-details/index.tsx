import { useParams } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import {
  useContractClassPrivateFunctions,
  useContractClassUnconstrainedFunctions,
  useContractClasses,
  useDeployedContractInstances,
} from "~/hooks";
import { getContractClassKeyValueData } from "./util";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { mapContractClasses, mapContractInstances } from "../contract/util";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { OptionButtons } from "./tabs";
import { contractClassTabs, type TabId } from "./constants";

export const ContractClassDetails: FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabId>("contractVersions");
  const { id, version } = useParams({
    from: "/contracts/classes/$id/versions/$version",
  });
  const onOptionSelect = (value: string) => {
    setSelectedTab(value as TabId);
  };
  const {
    data: classesData,
    isLoading: isLoadingClasses,
    error: errorClasses,
  } = useContractClasses(id);
  const {
    data: instancesData,
    isLoading: isLoadingInstances,
    error: errorInstances,
  } = useDeployedContractInstances(id);
  const contractClassPrivateFunctionsHookRes =
    useContractClassPrivateFunctions(id);
  const contractClassUnconstrainedFunctionsHookRes =
    useContractClassUnconstrainedFunctions(id);

  const contractClasses = mapContractClasses(classesData);
  const contractInstances = mapContractInstances(instancesData);

  const isOptionAvailable = {
    contractVersions: !!contractClasses && !!contractClasses.length,
    contractInstances: !!contractInstances && !!contractInstances.length,
    privateFunctions:
      !contractClassPrivateFunctionsHookRes.isLoading &&
      !contractClassPrivateFunctionsHookRes.error &&
      !!contractClassPrivateFunctionsHookRes.data,
    unconstrainedFunctions:
      !contractClassUnconstrainedFunctionsHookRes.isLoading &&
      !contractClassUnconstrainedFunctionsHookRes.error &&
      !!contractClassUnconstrainedFunctionsHookRes.data,
  };

  if (!id) return <div>No classId</div>;
  const selectedVersion = classesData?.find(
    (contract) => contract.version === Number(version),
  );
  if (!selectedVersion) return <div>No data</div>;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2>Contract class details</h2>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay
                data={getContractClassKeyValueData(selectedVersion)}
              />
            </div>
          </div>
        </div>
        <OptionButtons
          availableData={isOptionAvailable}
          requiredOptions={contractClassTabs}
          onOptionSelect={onOptionSelect}
          selectedItem={selectedTab}
        />
        <div className="flex flex-col gap-4 md:flex-row ">
          {selectedTab === "contractVersions" && (
            <div className="bg-white w-full rounded-lg">
              <ContractClassesTable
                title="Latest Contract Classes"
                contracts={mapContractClasses(classesData)}
                isLoading={isLoadingClasses}
                error={errorClasses}
                showContractVersions={true}
              />
            </div>
          )}
          {selectedTab === "contractInstances" && (
            <div className="bg-white w-full rounded-lg">
              <ContractInstancesTable
                title="Latest Contract Instances"
                contracts={mapContractInstances(instancesData)}
                isLoading={isLoadingInstances}
                error={errorInstances}
              />
            </div>
          )}
          {selectedTab === "privateFunctions" &&
            contractClassPrivateFunctionsHookRes.data && (
              <div className="bg-white w-full rounded-lg shadow-md p-4">
                <h4>Private Functions</h4>
                {contractClassPrivateFunctionsHookRes.data.map(
                  (privateFunction) => (
                    <div>
                      <h4>{privateFunction.privateFunction.selector.value}</h4>
                      <p>
                        artifactMetadataHash:{" "}
                        {privateFunction.artifactMetadataHash}
                      </p>
                      {privateFunction.privateFunctionTreeSiblingPath.map(
                        (path, index) => (
                          <p>
                            privateFunctionTreeSiblingPath-{index}: {path}
                          </p>
                        ),
                      )}
                      <p>
                        privateFunctionTreeLeafIndex:{" "}
                        {privateFunction.privateFunctionTreeLeafIndex}
                      </p>
                      {privateFunction.artifactFunctionTreeSiblingPath.map(
                        (path, index) => (
                          <p>
                            artifactFunctionTreeSiblingPath-{index}: {path}
                          </p>
                        ),
                      )}
                      <p>
                        artifactFunctionTreeLeafIndex:{" "}
                        {privateFunction.artifactFunctionTreeLeafIndex}
                      </p>
                      <div>
                        <p>
                          privateFunction.selector.type:{" "}
                          {privateFunction.privateFunction.selector.type}
                        </p>
                        <p>
                          privateFunction.selector.value:{" "}
                          {privateFunction.privateFunction.selector.value}
                        </p>

                        <p>
                          privateFunction.metadataHash:{" "}
                          {privateFunction.privateFunction.metadataHash}
                        </p>
                        <p>
                          privateFunction.vkHash:{" "}
                          {privateFunction.privateFunction.vkHash}
                        </p>
                        {
                          //<p>privateFunction.bytecode: {privateFunction.privateFunction.bytecode}</p>
                        }
                      </div>
                      <hr />
                    </div>
                  ),
                )}
              </div>
            )}
          {selectedTab === "unconstrainedFunctions" &&
            contractClassUnconstrainedFunctionsHookRes.data && (
              <div className="bg-white w-full rounded-lg shadow-md p-4">
                <h4>Unconstrained Functions</h4>
                {contractClassUnconstrainedFunctionsHookRes.data.map(
                  (unconstrainedFunction) => (
                    <div>
                      <h4>
                        {
                          unconstrainedFunction.unconstrainedFunction.selector
                            .value
                        }
                      </h4>
                      <p>
                        artifactMetadataHash:{" "}
                        {unconstrainedFunction.artifactMetadataHash}
                      </p>
                      <p>
                        privateFunctionsArtifactTreeRoot:{" "}
                        {unconstrainedFunction.privateFunctionsArtifactTreeRoot}
                      </p>
                      {unconstrainedFunction.artifactFunctionTreeSiblingPath.map(
                        (path, index) => (
                          <p>
                            artifactFunctionTreeSiblingPath-{index}: {path}
                          </p>
                        ),
                      )}
                      <p>
                        artifactFunctionTreeLeafIndex:{" "}
                        {unconstrainedFunction.artifactFunctionTreeLeafIndex}
                      </p>
                      <div>
                        <p>
                          unconstrainedFunction.selector.type:{" "}
                          {
                            unconstrainedFunction.unconstrainedFunction.selector
                              .type
                          }
                        </p>
                        <p>
                          unconstrainedFunction.selector.value:{" "}
                          {
                            unconstrainedFunction.unconstrainedFunction.selector
                              .value
                          }
                        </p>
                        <p>
                          unconstrainedFunction.metadataHash:{" "}
                          {
                            unconstrainedFunction.unconstrainedFunction
                              .metadataHash
                          }
                        </p>
                        {
                          //<p>unconstrainedFunction.bytecode: {unconstrainedFunction.unconstrainedFunction.bytecode}</p>
                        }
                      </div>
                      <hr />
                    </div>
                  ),
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
