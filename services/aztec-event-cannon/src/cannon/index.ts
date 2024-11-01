import {
  //EasyPrivateVotingContractArtifact,
  EasyPrivateVotingContract,
} from "../artifacts/EasyPrivateVoting.js";
import {
  AccountWallet,
  //CompleteAddress,
  //ContractDeployer,
  Fr,
  PXE,
  waitForPXE,
  //TxStatus,
  createPXEClient,
  FunctionSelector,
  SentTx,
  //getContractInstanceFromDeployParams,
} from "@aztec/aztec.js";
import { FunctionType } from "@aztec/foundation/abi";
import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import {
  // AztecAddress,
  deriveSigningKey,
} from "@aztec/circuits.js";
// import { TokenContract } from "@aztec/noir-contracts.js";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { AZTEC_RPC_URL } from "../environment.js";
import { logger } from "../logger.js";
import {
  broadcastPrivateFunction,
  broadcastUnconstrainedFunction,
} from "@aztec/aztec.js/deployment";

let pxe: PXE;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let wallets: AccountWallet[] = [];
// let accounts: CompleteAddress[] = [];

const setupSandbox = async () => {
  const { PXE_URL = AZTEC_RPC_URL } = process.env;
  const pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  return pxe;
};

export async function init() {
  pxe = await setupSandbox();
  wallets = await getInitialTestAccountsWallets(pxe);
  return {
    id: "Cannon",
    // eslint-disable-next-line @typescript-eslint/require-await
    shutdownCb: async () => {
      logger.info("Shutting down Cannon...");
    },
  };
}

export const truncateHashString = (value: string) => {
  const startHash = value.substring(0, 6);
  const endHash = value.substring(value.length - 4, value.length);
  return `${startHash}...${endHash}`;
};

async function logAndWaitForTx(tx: SentTx, additionalInfo: string) {
  const hash = truncateHashString((await tx.getTxHash()).to0xString());
  logger.info(`📫 TX ${hash} (${additionalInfo})`);
  const receipt = await tx.wait();
  logger.info(`⛏  TX ${hash} block ${receipt.blockNumber}`);
  return receipt;
}

function getFunctionSpacer(type: FunctionType) {
  if (type === FunctionType.PRIVATE) return type + "       ";
  if (type === FunctionType.UNCONSTRAINED) return type + " ";
  return type + "        ";
}

export async function start() {
  logger.info("Starting Cannon...");
  const secretKey = Fr.random();
  const salt = Fr.random();

  const schnorrAccount = getSchnorrAccount(
    pxe,
    secretKey,
    deriveSigningKey(secretKey),
    salt
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address, publicKeys, partialAddress } =
    schnorrAccount.getCompleteAddress();
  await logAndWaitForTx(schnorrAccount.deploy(), "Deploying account");
  const wallet = await schnorrAccount.getWallet();
  const votingContractTx = EasyPrivateVotingContract.deploy(
    wallet,
    address
  ).send();
  logger.info(
    `📫 TX ${truncateHashString(
      (await votingContractTx.getTxHash()).to0xString()
    )} (Deploying voting contract)`
  );
  const votingContract = await votingContractTx.deployed();
  const addressString = votingContract.address.toString();
  logger.info(`⛏  Voting Contract deployed at: ${addressString}`);

  for (const fn of votingContract.artifact.functions) {
    logger.info(
      `${getFunctionSpacer(fn.functionType)}${fn.name}`
    );
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
  //const tx4 = await (await broadcastUnconstrainedFunction(wallet, artifact, selector)).send().wait();
}
