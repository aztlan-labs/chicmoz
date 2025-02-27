import { useParams } from "@tanstack/react-router";
import { type FC } from "react";
import { KeyValueDisplay } from "~/components/info-display/key-value-display";
import { Loader } from "~/components/loader";
import {
  useContractClass,
  useContractClasses,
  useDeployedContractInstances,
  useSubTitle,
} from "~/hooks";
import { TabSection } from "./tabs-section";
import { getContractClassKeyValueData } from "./util";

export const ContractClassDetails: FC = () => {
  const { id, version } = useParams({
    from: "/contracts/classes/$id/versions/$version",
  });
  useSubTitle(`Ctrct cls ${id}`);

  const contractClassesRes = useContractClasses(id);
  const contractInstanceRes = useDeployedContractInstances(id);

  const selectedVersionWithArtifactRes = useContractClass({
    classId: id,
    version: version,
    includeArtifactJson: true,
  });

  if (!id) return <div>No classId</div>;
  if (!version) return <div>No version provided</div>;

  const selectedVersionRes = selectedVersionWithArtifactRes?.data
    ? {
        ...selectedVersionWithArtifactRes,
        data: [selectedVersionWithArtifactRes.data],
      }
    : {
        ...contractClassesRes,
        data: contractClassesRes.data?.filter(
          (contract) => contract.version === Number(version)
        ),
      };

  if (!selectedVersionRes?.data?.[0]) return <div>No data</div>;

  const headerStr = `Contract class details ${
    selectedVersionRes?.data?.[0]?.artifactContractName
      ? selectedVersionRes?.data?.[0]?.artifactContractName
      : ""
  }`;

  return (
    <div className="mx-auto px-[70px] max-w-[1440px]">
      <div className="flex flex-wrap m-3">
        <h3 className="mt-2 text-primary md:hidden">{headerStr}</h3>
        <h2 className="hidden md:block md:mt-6 md:text-primary">{headerStr}</h2>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          {selectedVersionRes.isLoading && <Loader amount={1} />}
          {selectedVersionRes.error && <div>error</div>}
          {selectedVersionRes.data && (
            <KeyValueDisplay
              data={getContractClassKeyValueData(selectedVersionRes.data[0])}
            />
          )}
        </div>
      </div>
      <div className="mt-5">
        <TabSection
          contractClasses={contractClassesRes}
          contractInstances={contractInstanceRes}
          selectedVersion={selectedVersionRes}
        />
      </div>
    </div>
  );
};
