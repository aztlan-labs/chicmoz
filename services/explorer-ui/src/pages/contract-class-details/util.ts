import { type ChicmozL2ContractClassRegisteredEvent } from "@chicmoz-pkg/types";
import { routes } from "~/routes/__root";
import { API_URL, aztecExplorer } from "~/service/constants";

export const getContractClassKeyValueData = (
  data: ChicmozL2ContractClassRegisteredEvent
) => {
  return [
    {
      label: "BLOCK HASH",
      value: data.blockHash,
      link: `${routes.blocks.route}/${data.blockHash}`,
    },
    {
      label: "CLASS ID",
      value: data.contractClassId,
    },
    {
      label: "VERSION",
      value: data.version.toString(),
    },
    {
      label: "ARTIFACT HASH",
      value: data.artifactHash,
    },
    {
      label: "PRIVATE FUNCTIONS ROOT",
      value: data.privateFunctionsRoot,
    },
    {
      label: "API ENDPOINT",
      value: "View raw data",
      extLink: `${API_URL}/${aztecExplorer.getL2ContractClassByIdAndVersion(
        data.contractClassId,
        data.version.toString()
      )}`,
    },
    {
      label: "IS TOKEN CONTRACT",
      value: data.isToken ? "✅" : "❌",
    },
    {
      label: "WHY NOT TOKEN",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      value: data.whyNotToken ? data.whyNotToken : "N/A",
    },
  ];
}

export const getArtifactData = (selectedVersion: ChicmozL2ContractClassRegisteredEvent) => {
  let artifact;
  let privFunc: { [functionName: string]: { [paramName: string]: string } } = {};
  let pubFunc: { [functionName: string]: { [paramName: string]: string } } = {};
  let uncFunc: { [functionName: string]: { [paramName: string]: string } } = {};

  if (selectedVersion.artifactJson) {
    try {
      artifact = JSON.parse(selectedVersion.artifactJson);

      artifact.functions.forEach((func: any) => {
        if (!func.abi || !func.abi.parameters) return;
        func.abi.parameters.forEach((param: any) => {
          if (param.name === "inputs") return;
          const paramType = param.type?.kind || "unknown";
          if (func.is_unconstrained) {
            if (!uncFunc[func.name]) uncFunc[func.name] = {};
            uncFunc[func.name][param.name] = paramType;
          }
          if (func.custom_attributes && func.custom_attributes.includes("public")) {
            if (!pubFunc[func.name]) pubFunc[func.name] = {};
            pubFunc[func.name][param.name] = paramType;
          }
          if (func.custom_attributes && func.custom_attributes.includes("private")) {
            if (!privFunc[func.name]) privFunc[func.name] = {};
            privFunc[func.name][param.name] = paramType;
          }
        });
      });
    } catch (error) {
      console.error("Error parsing artifact JSON:", error);
    }
  }
  return {
    artifact,
    privFunc,
    pubFunc,
    uncFunc
  };
};
