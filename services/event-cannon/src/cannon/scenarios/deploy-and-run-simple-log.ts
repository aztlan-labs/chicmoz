import { DeploySentTx, waitForPXE } from "@aztec/aztec.js";
import { SimpleLoggingContract } from "../../artifacts/SimpleLogging.js";
import SimpleLoggingContractArtifactJson from "../../contract-projects/SimpleLogging/target/simple_logging-SimpleLogging.json" assert { type: "json" };
import { logger } from "../../logger.js";
import { getAztecNodeClient, getPxe, getWallets } from "../pxe.js";
import {
  deployContract,
  logAndWaitForTx,
  registerContractClassArtifact,
} from "./utils/index.js";

export async function run() {
  logger.info("===== SIMPLE LOG CONTRACT =====");
  const pxe = getPxe();
  await waitForPXE(pxe);
  const namedWallets = getWallets();

  const deployerWallet = namedWallets.alice;

  const contractLoggingName = "Voting Contract";

  const simpleLoggingContractDeployer = await deployContract({
    contractLoggingName,
    deployFn: (): DeploySentTx<SimpleLoggingContract> =>
      SimpleLoggingContract.deploy(deployerWallet).send(),
    node: getAztecNodeClient(),
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await registerContractClassArtifact(
    contractLoggingName,
    SimpleLoggingContractArtifactJson,
    simpleLoggingContractDeployer.instance.contractClassId.toString(),
    simpleLoggingContractDeployer.instance.version
  );

  await logAndWaitForTx(
    simpleLoggingContractDeployer.methods.increase_counter_public(1).send(),
    "Increase counter public"
  );
}
