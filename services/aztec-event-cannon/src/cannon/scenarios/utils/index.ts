import { SentTx } from "@aztec/aztec.js";
import { FunctionType } from "@aztec/foundation/abi";
import { logger } from "../../../logger.js";
import { EasyPrivateVotingContract } from "../../../artifacts/EasyPrivateVoting.js";

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

export const deployContract = async <
  Contract extends typeof EasyPrivateVotingContract,
  DeployArgs extends Parameters<Contract["deploy"]>
>({
  contractLoggingName,
  contract,
  contractDeployArgs,
}: {
  contractLoggingName: string;
  contract: Contract;
  contractDeployArgs: DeployArgs;
}): Promise<EasyPrivateVotingContract> => {
  const contractTx = contract.deploy.apply(null, contractDeployArgs).send();
  logger.info(
    `📫 ${contractLoggingName} ${(
      await contractTx.getTxHash()
    ).to0xString()} (Deploying contract)`
  );
  const deployedContract = await contractTx.deployed();
  const addressString = deployedContract.address.toString();
  logger.info(`⛏  ${contractLoggingName} deployed at: ${addressString}`);
  return deployedContract;
};
