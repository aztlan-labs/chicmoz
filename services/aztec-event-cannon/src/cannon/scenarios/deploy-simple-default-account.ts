import { waitForPXE } from "@aztec/aztec.js";
import { logger } from "../../logger.js";
import { getPxe } from "../pxe.js";
import { getNewAccount } from "./utils/index.js";

export async function run() {
  logger.info("VOTING CONTRACT - deploy & broadcast functions");
  const pxe = getPxe();
  await waitForPXE(pxe);
  await getNewAccount( pxe );
}
