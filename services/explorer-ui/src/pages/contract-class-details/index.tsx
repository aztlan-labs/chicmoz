import { useParams } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { OptionButtons } from "~/components/option-buttons";
import {
  useContractClassPrivateFunctions,
  useContractClassUnconstrainedFunctions,
  useContractClasses,
  useDeployedContractInstances,
  useSubTitle,
} from "~/hooks";
import { mapContractClasses, mapContractInstances } from "../contract/util";
import { contractClassTabs, type TabId } from "./constants";
import { getContractClassKeyValueData } from "./util";

export const ContractClassDetails: FC = () => {
  const { id, version } = useParams({
    from: "/contracts/classes/$id/versions/$version",
  });
  useSubTitle(`Ctrct cls ${id}`);
  const [selectedTab, setSelectedTab] = useState<TabId>("contractVersions");
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

  const selectedVersion = classesData?.find(
    (contract) => contract.version === Number(version),
  );
  // const isOptionAvailable = {
  //   contractVersions: !!contractClasses && !!contractClasses.length,
  //   contractInstances: !!contractInstances && !!contractInstances.length,
  //   privateFunctions:
  //     !contractClassPrivateFunctionsHookRes.isLoading &&
  //     !contractClassPrivateFunctionsHookRes.error &&
  //     !!contractClassPrivateFunctionsHookRes.data &&
  //     !!contractClassPrivateFunctionsHookRes.data.length,
  //   unconstrainedFunctions:
  //     !contractClassUnconstrainedFunctionsHookRes.isLoading &&
  //     !contractClassUnconstrainedFunctionsHookRes.error &&
  //     !!contractClassUnconstrainedFunctionsHookRes.data &&
  //     !!contractClassUnconstrainedFunctionsHookRes.data.length,
  //   artifactJson: !!selectedVersion && !!selectedVersion.artifactJson,
  //   functionJson: !!selectedVersion && !!selectedVersion.artifactJson
  // };

  if (!id) return <div>No classId</div>;
  if (!selectedVersion) return <div>No data</div>;
  let artifact
  let privFunc
  let pubFunc
  let uncFunc
  if(selectedVersion.artifactJson){
    artifact = JSON.parse(selectedVersion.artifactJson)
    uncFunc = {}
    privFunc = {}
    pubFunc = {}
    artifact.functions.map((func:any)=> {
      func.abi.parameters.map((param:any)=>{
        if(func.is_unconstrained){
          uncFunc[func.name] = {[param.name]:param.type.kind}
        }
        if(func.custom_attributes){
          pubFunc[func.name] = {[param.name]:param.type.kind}
        }
        if(func.custom_attributes.includes("private")){
          privFunc[func.name] = {[param.name]:param.type.kind}
        }
      })
    })
  }

  const isOptionAvailable = {
    contractVersions: !!contractClasses && !!contractClasses.length,
    contractInstances: !!contractInstances && !!contractInstances.length,
    privateFunctions: !!selectedVersion&&Object.values(privFunc).length > 1,
    unconstrainedFunctions: !!selectedVersion&&Object.values(uncFunc).length > 1,
    publicFunctions: !!selectedVersion&&Object.values(pubFunc).length > 1,
    artifactJson: !!selectedVersion && !!selectedVersion.artifactJson,
    functionJson: !!selectedVersion && !!selectedVersion.artifactJson
  };

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2>Contract class details {selectedVersion.artifactContractName ? ` (${selectedVersion.artifactContractName})` : ""}
            </h2>
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
          options={contractClassTabs}
          availableOptions={isOptionAvailable}
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
          {selectedTab === "publicFunctions" && pubFunc && (
            <div className="bg-white w-full rounded-lg shadow-md p-4">
              <h4>Public Functions</h4>
              <pre className="overflow-auto">
                {JSON.stringify(
                  pubFunc,
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
          {selectedTab === "privateFunctions" &&
            privFunc && (
              <div className="bg-white w-full rounded-lg shadow-md p-4">
                <h4>Private Functions</h4>
                <pre className="overflow-auto">
                {JSON.stringify(
                  privFunc,
                  null,
                  2,
                )}
              </pre>
                {/* {contractClassPrivateFunctionsHookRes.data.map(
                  (privateFunction) => (
                    <div>
                      <h4>
                        {"0x" +
                          privateFunction.privateFunction.selector.value.toString(
                            16,
                          )}
                      </h4>
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
                )} */}
              </div>
            )}
          {selectedTab === "unconstrainedFunctions" &&
            uncFunc && (
              <div className="bg-white w-full rounded-lg shadow-md p-4">
                <h4>Unconstrained Functions</h4>
                <pre className="overflow-auto">
                  {JSON.stringify(
                    uncFunc,
                    null,
                    2,
                  )}
                </pre>
                {/* {contractClassUnconstrainedFunctionsHookRes.data.map(
                  (unconstrainedFunction) => (
                    <div>
                      <h4>
                        {"0x" +
                          unconstrainedFunction.unconstrainedFunction.selector.value.toString(
                            16,
                          )}
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
                )} */}
              </div>
            )}
          {selectedTab === "artifactJson" && selectedVersion.artifactJson && (
            <div className="bg-white w-full rounded-lg shadow-md p-4">
              <h4>Artifact JSON</h4>
              <pre className="overflow-auto">
                {JSON.stringify(
                  artifact,
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
