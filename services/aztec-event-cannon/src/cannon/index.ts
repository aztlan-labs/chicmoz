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
import {logger} from "../logger.js";

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
  const wallet = await schnorrAccount.getWallet();
  const votingContract = await EasyPrivateVotingContract.deploy(wallet, address)
    .send()
    .deployed();
  const addressString = votingContract.address.toString();
  logger.info(`Voting Contract deployed at: ${addressString}`);
}
