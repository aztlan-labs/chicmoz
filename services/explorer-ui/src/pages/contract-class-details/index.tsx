// @ts-nocheck
import { useParams } from "@tanstack/react-router";
import { useState, type FC } from "react";
import { ContractClassesTable } from "~/components/contracts/classes/table";
import { ContractInstancesTable } from "~/components/contracts/instances/table";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { OptionButtons } from "~/components/option-buttons";
import {
  useContractClass,
  useContractClassPrivateFunctions,
  useContractClassUnconstrainedFunctions,
  useContractClasses,
  useDeployedContractInstances,
  useSubTitle,
} from "~/hooks";
import { mapContractClasses, mapContractInstances } from "../contract/util";
import { contractClassTabs, type TabId } from "./constants";
import { getContractClassKeyValueData } from "./util";
import { TabSection } from "./tabs-section";

export const ContractClassDetails: FC = () => {

  const { id, version } = useParams({
    from: "/contracts/classes/$id/versions/$version",
  });
  useSubTitle(`Ctrct cls ${id}`);

  const contractClassesData = useContractClasses(id);
  const contractInstanceData = useDeployedContractInstances(id);

  const {
    data: selectedVersionWithArtifact,
    isLoading,
    error,
  } = useContractClass({
    classId: id,
    version: version,
    includeArtifactJson: true,
  });

  if (!id) return <div>No classId</div>;
  if (!selectedVersionWithArtifact) return <div>No version provided</div>;


  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <div>
            <h2>Contract class details {selectedVersionWithArtifact.artifactContractName ? `` : ""}
            </h2>
            { isLoading && <div>Loading artifact...</div>}
            { error && <div>Error artifact: {error.message}</div>}
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <KeyValueDisplay
                data={getContractClassKeyValueData(selectedVersionWithArtifact)}
              />
            </div>
          </div>
          <div className="mt-5">
            <TabSection
              contractClasses={contractClassesData}
              contractInstances={contractInstanceData}
              selectedVersion={selectedVersionWithArtifact}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
