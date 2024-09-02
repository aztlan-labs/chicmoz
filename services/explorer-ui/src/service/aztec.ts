import { createPXEClient, waitForPXE } from "@aztec/aztec.js";

export const setupSandbox = async () => {
  const PXE_URL = "http://localhost:8080";
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  return pxe;
};
