import { VerifyInstanceDeploymentPayload } from "types.js";

export const verifyInstanceDeploymentPayload = (
  payload: VerifyInstanceDeploymentPayload
): boolean => {
  // TODO
  return !!payload.publicKeys && !!payload.deployer && !!payload.salt;
};
