import { DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { SimpleLoggingContract } from "../../artifacts/SimpleLogging.js";
import { logger } from "../../logger.js";
import { getPxe, getWallets } from "../pxe.js";
import { deployContract, logAndWaitForTx } from "./utils/index.js";

export async function run() {
  logger.info("SIMPLE LOG");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;

  const simpleLoggingContractDeployer = await deployContract({
    contractLoggingName: "Voting Contract",
    deployFn: (): DeploySentTx<SimpleLoggingContract> =>
      SimpleLoggingContract.deploy(deployerWallet).send()
  });
  await logAndWaitForTx(
    simpleLoggingContractDeployer.methods.increase_counter_public(1).send(),
    "Increase counter public"
  );
}
