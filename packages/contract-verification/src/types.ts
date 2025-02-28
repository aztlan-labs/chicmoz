import { z } from "zod";

export type VerifyArtifactPayload = {
  stringifiedArtifactJson: string;
};
export type IsTokenArtifactResult = {
  result: boolean;
  contractName: string;
  details: string;
};
export const verifyInstanceDeploymentPayloadSchema = z.object({
  stringifiedArtifactJson: z.string().optional(),
  publicKeysString: z.string(),
  salt: z.string(),
  deployer: z.string(),
  constructorArgs: z.string().array(),
});
export type VerifyInstanceDeploymentPayload = z.infer<
  typeof verifyInstanceDeploymentPayloadSchema
>;
