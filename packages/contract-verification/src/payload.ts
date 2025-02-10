import {
  NoirCompiledContract,
  getContractClassFromArtifact,
  loadContractArtifact,
} from "@aztec/aztec.js";
import { chicmozL2ContractClassRegisteredEventSchema, ChicmozL2ContractClassRegisteredEvent } from "@chicmoz-pkg/types";

export const loadArtifact = async (stringifiedArtifactJson:string) => {
    const artifact = await getContractClassFromArtifact(
      loadContractArtifact(
        JSON.parse(stringifiedArtifactJson) as unknown as NoirCompiledContract
      )
    );
    chicmozL2ContractClassRegisteredEventSchema.parse(artifact)
    return { ...artifact }
}

export const createArtifact = async (
  contractLoggingName: string,
  artifactObj: { default: NoirCompiledContract } | NoirCompiledContract,
  contractClassId: string,
  version: number,
) => {
  const artifactJson = (artifactObj as { default: NoirCompiledContract })
    .default
    ? (artifactObj as { default: NoirCompiledContract }).default
    : artifactObj;
  const stringifiedArtifactJson = JSON.stringify(artifactJson);
  await loadArtifact(stringifiedArtifactJson);
};