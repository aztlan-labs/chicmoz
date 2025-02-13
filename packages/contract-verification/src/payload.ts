import {
  NoirCompiledContract,
  getContractClassFromArtifact,
  loadContractArtifact,
} from "@aztec/aztec.js";

export const loadCCFromArtifact = async (stringifiedArtifactJson:string) => {
    const artifact = await getContractClassFromArtifact(
      loadContractArtifact(
        JSON.parse(stringifiedArtifactJson) as unknown as NoirCompiledContract
      )
    );
    return { ...artifact }
}

export const loadArtifact = (artifactString: string) => {
  return loadContractArtifact(
    JSON.parse(artifactString) as unknown as NoirCompiledContract
  )
}

export const createArtifact = (
  _contractLoggingName: string,
  artifactObj: { default: NoirCompiledContract } | NoirCompiledContract,
  _contractClassId: string,
  _version: number,
) => {
  const artifactJson = (artifactObj as { default: NoirCompiledContract })
    .default
    ? (artifactObj as { default: NoirCompiledContract }).default
    : artifactObj;
  const stringifiedArtifactJson = JSON.stringify(artifactJson);
  loadArtifact(stringifiedArtifactJson);
};
