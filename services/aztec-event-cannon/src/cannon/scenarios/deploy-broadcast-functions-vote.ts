import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import { Fr, FunctionSelector } from "@aztec/aztec.js";
import {
  broadcastPrivateFunction,
  broadcastUnconstrainedFunction,
} from "@aztec/aztec.js/deployment";
import { deriveSigningKey } from "@aztec/circuits.js";
import { FunctionType } from "@aztec/foundation/abi";
import { EasyPrivateVotingContract } from "../../artifacts/EasyPrivateVoting.js";
import { logger } from "../../logger.js";
import { getPxe } from "../pxe.js";
import {
  deployContract,
  getFunctionSpacer,
  logAndWaitForTx,
} from "./utils/index.js";

export async function run() {
  logger.info("VOTING CONTRACT - deploy & broadcast functions");
  const secretKey = Fr.random();
  const salt = Fr.random();
  const pxe = getPxe();

  const schnorrAccount = getSchnorrAccount(
    pxe,
    secretKey,
    deriveSigningKey(secretKey),
    salt
  );
  const { address } = schnorrAccount.getCompleteAddress();
  await logAndWaitForTx(schnorrAccount.deploy(), "Deploying account");
  const wallet = await schnorrAccount.getWallet();
  const votingContract = await deployContract({
    contractLoggingName: "Voting Contract",
    contract: EasyPrivateVotingContract,
    contractDeployArgs: [wallet, address],
  });

  for (const fn of votingContract.artifact.functions) {
    logger.info(`${getFunctionSpacer(fn.functionType)}${fn.name}`);
    if (fn.functionType === FunctionType.PRIVATE) {
      const selector = FunctionSelector.fromNameAndParameters(
        fn.name,
        fn.parameters
      );
      await logAndWaitForTx(
        (
          await broadcastPrivateFunction(
            wallet,
            votingContract.artifact,
            selector
          )
        ).send(),
        `Broadcasting private function ${fn.name}`
      );
    }
    if (fn.functionType === FunctionType.UNCONSTRAINED) {
      const selector = FunctionSelector.fromNameAndParameters(
        fn.name,
        fn.parameters
      );
      await logAndWaitForTx(
        (
          await broadcastUnconstrainedFunction(
            wallet,
            votingContract.artifact,
            selector
          )
        ).send(),
        `Broadcasting unconstrained function ${fn.name}`
      );
    }
  }
  // TODO: add actual voting function calls
}
