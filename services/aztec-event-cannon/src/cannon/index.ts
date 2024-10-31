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
  //getContractInstanceFromDeployParams,
} from "@aztec/aztec.js";
import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import {
  // AztecAddress,
  deriveSigningKey,
} from "@aztec/circuits.js";
// import { TokenContract } from "@aztec/noir-contracts.js";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { AZTEC_RPC_URL } from "../environment.js";
import { logger } from "../logger.js";
import { broadcastPrivateFunction } from "@aztec/aztec.js/deployment";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tx = await schnorrAccount.deploy().wait();
  logger.info(`Blocknumber: ${tx.blockNumber}`);
  const wallet = await schnorrAccount.getWallet();
  const votingContract = await EasyPrivateVotingContract.deploy(wallet, address)
    .send()
    .deployed();
  const addressString = votingContract.address.toString();
  logger.info(`Voting Contract deployed at: ${addressString}`);

  const artifact = EasyPrivateVotingContract.artifact;

  const constructorArtifact = artifact.functions.find(
    (fn) => fn.name == "constructor"
  );
  if (!constructorArtifact) {
    throw new Error(
      "No constructor found in the StatefulTestContract artifact. Does it still exist?"
    );
  }

  // TODO: why do I throw?
  const selector = FunctionSelector.fromNameAndParameters(
    constructorArtifact.name,
    constructorArtifact.parameters
  );

  const tx2 = await (await broadcastPrivateFunction(wallet, artifact, selector))
    .send()
    .wait();
  logger.info(`Blocknumber: ${tx2.blockNumber}`);
}
