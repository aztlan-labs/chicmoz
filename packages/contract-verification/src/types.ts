import { z } from "zod";

// TODO: change to VerifyArtifactPayload
export type ArtifactPayload = {
  stringifiedArtifactJson: string;
};
export type IsTokenArtifactResult = {
  result: boolean;
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
