import {
  NoirCompiledContract,
  getContractClassFromArtifact,
  loadContractArtifact,
} from "@aztec/aztec.js";
import { ChicmozL2ContractClassRegisteredEvent } from "@chicmoz-pkg/types";
import { ArtifactPayload } from "types.js";

export const verifyArtifactPayload = async (
  artifactPayload: ArtifactPayload,
  storedArtifact: ChicmozL2ContractClassRegisteredEvent
): Promise<boolean> => {
  const parsedArtifact = JSON.parse(
    artifactPayload.stringifiedArtifactJson
  ) as NoirCompiledContract;
  const loadedArtifact = loadContractArtifact(parsedArtifact);
  const contractClass = await getContractClassFromArtifact(loadedArtifact);
  const isMatchingByteCode = storedArtifact.packedBytecode.equals(
    contractClass.packedBytecode
  );
  return isMatchingByteCode;
};
