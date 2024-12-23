import {
  SchnorrAccountContractArtifact,
  getSchnorrAccount,
} from "@aztec/accounts/schnorr";
import {
  AztecNode,
  BatchCall,
  Contract,
  DeploySentTx,
  Fr,
  FunctionSelector,
  PXE,
  SentTx,
  Wallet,
} from "@aztec/aztec.js";
import {
  broadcastPrivateFunction,
  broadcastUnconstrainedFunction,
  deployInstance,
  registerContractClass,
} from "@aztec/aztec.js/deployment";
import { deriveSigningKey } from "@aztec/circuits.js";
import { FunctionType } from "@aztec/foundation/abi";
import { ContractClassRegisteredEvent } from "@aztec/protocol-contracts/class-registerer";
import { logger } from "../../../logger.js";

export const truncateHashString = (value: string) => {
  const startHash = value.substring(0, 6);
  const endHash = value.substring(value.length - 4, value.length);
  return `${startHash}...${endHash}`;
};

export const logAndWaitForTx = async (tx: SentTx, additionalInfo: string) => {
  const hash = (await tx.getTxHash()).toString();
  logger.info(`📫 TX ${hash} (${additionalInfo})`);
  const receipt = await tx.wait();
  logger.info(
    `⛏  TX ${hash} (${additionalInfo}) block ${receipt.blockNumber}`
  );
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

const getNewContractClassId = async (node: AztecNode, blockNumber?: number) => {
  if (!blockNumber) return undefined;
  const block = await node.getBlock(blockNumber);
  if (!block) throw new Error(`Block ${blockNumber} not found`);
  const contractClassLogs = block.body.txEffects
    .flatMap((txEffect) => (txEffect ? [txEffect.contractClassLogs] : []))
    .flatMap((txLog) => txLog.unrollLogs());

  const contractClasses = contractClassLogs
    .filter((log) =>
      ContractClassRegisteredEvent.isContractClassRegisteredEvent(log.data)
    )
    .map((log) => ContractClassRegisteredEvent.fromLog(log.data))
    .map((e) => e.toContractClassPublic());

  return contractClasses[0]?.id.toString();
};

export const deployContract = async <T extends Contract>({
  contractLoggingName,
  deployFn,
  broadcastWithWallet,
  node,
}: {
  contractLoggingName: string;
  deployFn: () => DeploySentTx<T>;
  broadcastWithWallet?: Wallet;
  node: AztecNode;
}): Promise<T> => {
  logger.info(`DEPLOYING ${contractLoggingName}`);
  const contractTx = deployFn();
  const hash = (await contractTx.getTxHash()).toString();
  logger.info(`📫 ${contractLoggingName} txHash: ${hash} (Deploying contract)`);
  const deployedContract = await contractTx.deployed();
  const receipt = await contractTx.wait();
  const addressString = deployedContract.address.toString();
  const newClassId = await getNewContractClassId(node, receipt.blockNumber);
  const classIdString = newClassId
    ? `(🍏 also, a new contract class was added: ${newClassId})`
    : `(🍎 attached classId: ${deployedContract.instance.contractClassId.toString()})`;
  logger.info(
    `⛏  ${contractLoggingName} instance deployed at: ${addressString} block: ${receipt.blockNumber} ${classIdString}`
  );
  if (broadcastWithWallet) {
    await broadcastFunctions({
      wallet: broadcastWithWallet,
      contract: deployedContract,
    });
  }
  return deployedContract;
};

export const broadcastFunctions = async ({
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

export const publicDeployAccounts = async (
  sender: Wallet,
  accountsToDeploy: Wallet[],
  pxe: PXE
) => {
  const accountAddressesToDeploy = await Promise.all(
    accountsToDeploy.map(async (a) => {
      const address = a.getAddress();
      const isDeployed = await pxe.isContractPubliclyDeployed(address);
      return { address, isDeployed };
    })
  ).then((results) =>
    results
      .filter((result) => !result.isDeployed)
      .map((result) => result.address)
  );
  if (accountAddressesToDeploy.length === 0) return;
  const instances = await Promise.all(
    accountAddressesToDeploy.map((account) =>
      sender.getContractInstance(account)
    )
  );
  const batch = new BatchCall(sender, [
    (
      await registerContractClass(sender, SchnorrAccountContractArtifact)
    ).request(),
    ...instances.map((instance) => deployInstance(sender, instance!).request()),
  ]);
  await batch.send().wait();
};
