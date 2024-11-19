import { Fr, FunctionSelector, PXE, SentTx, Wallet } from "@aztec/aztec.js";
import { FunctionType } from "@aztec/foundation/abi";
import { deriveSigningKey } from "@aztec/circuits.js";
import { logger } from "../../../logger.js";
import { EasyPrivateVotingContract } from "../../../artifacts/EasyPrivateVoting.js";
import {
  broadcastPrivateFunction,
  broadcastUnconstrainedFunction,
} from "@aztec/aztec.js/deployment";
import { getSchnorrAccount } from "@aztec/accounts/schnorr";

export const truncateHashString = (value: string) => {
  const startHash = value.substring(0, 6);
  const endHash = value.substring(value.length - 4, value.length);
  return `${startHash}...${endHash}`;
};

export const logAndWaitForTx = async (tx: SentTx, additionalInfo: string) => {
  const hash = (await tx.getTxHash()).to0xString();
  logger.info(`📫 TX ${hash} (${additionalInfo})`);
  const receipt = await tx.wait();
  logger.info(`⛏  TX ${hash} block ${receipt.blockNumber}`);
  return receipt;
};

export const getFunctionSpacer = (type: FunctionType) => {
  if (type === FunctionType.PRIVATE) return type + "       ";
  if (type === FunctionType.UNCONSTRAINED) return type + " ";
  return type + "        ";
};

export const getNewSchnorrAccount = async ({
  pxe,
  secretKey,
  salt,
}: {
  pxe: PXE;
  secretKey: Fr;
  salt: Fr;
}) => {
  logger.info("  Creating new Schnorr account...");
  const schnorrAccount = getSchnorrAccount(
    pxe,
    secretKey,
    deriveSigningKey(secretKey),
    salt
  );
  logger.info(
    `    Schnorr account created ${schnorrAccount.getAddress().toString()}`
  );
  const { address } = schnorrAccount.getCompleteAddress();
  logger.info("    Deploying Schnorr account to network...");
  await logAndWaitForTx(schnorrAccount.deploy(), "Deploying account");
  logger.info("    Getting Schnorr account wallet...");
  const wallet = await schnorrAccount.getWallet();
  logger.info(`    🔐 Schnorr account created at: ${address.toString()}`);
  return { schnorrAccount, wallet, address };
};

export const getNewAccount = async (pxe: PXE) => {
  const secretKey = Fr.random();
  const salt = Fr.random();
  return getNewSchnorrAccount({
    pxe,
    secretKey,
    salt,
  });
};

export const deployContract = async <
  Contract extends typeof EasyPrivateVotingContract,
  DeployArgs extends Parameters<Contract["deploy"]>,
>({
  contractLoggingName,
  contract,
  contractDeployArgs,
  broadcast,
}: {
  contractLoggingName: string;
  contract: Contract;
  contractDeployArgs: DeployArgs;
  broadcast?: boolean;
}): Promise<EasyPrivateVotingContract> => {
  logger.info(`DEPLOYING ${contractLoggingName}`);
  const contractTx = contract.deploy.apply(null, contractDeployArgs).send();
  logger.info(
    `📫 ${contractLoggingName} ${(
      await contractTx.getTxHash()
    ).to0xString()} (Deploying contract)`
  );
  const deployedContract = await contractTx.deployed();
  const addressString = deployedContract.address.toString();
  logger.info(`⛏  ${contractLoggingName} deployed at: ${addressString}`);
  if (broadcast) {
    await broadcastFunctions({
      wallet: contractDeployArgs[0],
      contract: deployedContract,
    });
  }
  return deployedContract;
};

export const broadcastFunctions = async <
  Contract extends EasyPrivateVotingContract,
>({
  wallet,
  contract,
}: {
  wallet: Wallet;
  contract: Contract;
}) => {
  logger.info("BROADCASTING FUNCTIONS");
  for (const fn of contract.artifact.functions) {
    logger.info(`${getFunctionSpacer(fn.functionType)}${fn.name}`);
    if (fn.functionType === FunctionType.PRIVATE) {
      const selector = FunctionSelector.fromNameAndParameters(
        fn.name,
        fn.parameters
      );
      await logAndWaitForTx(
        (
          await broadcastPrivateFunction(wallet, contract.artifact, selector)
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
            contract.artifact,
            selector
          )
        ).send(),
        `Broadcasting unconstrained function ${fn.name}`
      );
    }
  }
};
