// @ts-nocheck
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
  if (selectedVersion.artifactJson) {
    artifact = JSON.parse(selectedVersion.artifactJson)
    uncFunc = {}
    privFunc = {}
    pubFunc = {}
    artifact.functions.map((func: any) => {
      func.abi.parameters.map((param: any) => {
        if (param.name === "inputs") return
        if (func.is_unconstrained) {
          if (!uncFunc[func.name + ' ']) uncFunc[func.name + ' '] = {}
          Object.assign(uncFunc[func.name + ' '], { [param.name]: param.type.kind })
        }
        if (func.custom_attributes.includes("public")) {
          if (!pubFunc[func.name + ' ']) pubFunc[func.name + ' '] = {}
          Object.assign(pubFunc[func.name + ' '], { [param.name]: param.type.kind })
        }
        if (func.custom_attributes.includes("private")) {
          if (!privFunc[func.name + ' ']) privFunc[func.name + ' '] = {}
          Object.assign(privFunc[func.name + ' '], { [param.name]: param.type.kind })
        }
      })
    })
  }

  const isOptionAvailable = {
    contractVersions: !!contractClasses && !!contractClasses.length,
    contractInstances: !!contractInstances && !!contractInstances.length,
    privateFunctions: !!selectedVersion && privFunc && Object.values(privFunc).length > 1,
    unconstrainedFunctions: !!selectedVersion && uncFunc && Object.values(uncFunc).length > 1,
    publicFunctions: !!selectedVersion && pubFunc && Object.values(pubFunc).length > 1,
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
