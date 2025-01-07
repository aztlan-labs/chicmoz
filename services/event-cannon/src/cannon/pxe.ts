import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import {
  AccountWallet,
  AztecNode,
  PXE,
  createAztecNodeClient,
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import { AZTEC_RPC_URL } from "../environment.js";
import { logger } from "../logger.js";

let pxe: PXE;
let aztecNode: AztecNode;
let namedWallets: {
  alice: AccountWallet;
  bob: AccountWallet;
  charlie: AccountWallet;
} | null = null;

let version: string | null = null;

export const setup = async () => {
  aztecNode = createAztecNodeClient(AZTEC_RPC_URL);
  const v = await aztecNode.getNodeVersion();
  if (v === "0.1.0") {
    // TODO: this is a temporary workaround for the versioning issue
    version = "0.69.0";
  } else {
    logger.info(`Finally the getNodeVersion is working! ${v}`);
    version = v;
  }
  pxe = createPXEClient(AZTEC_RPC_URL);
  await waitForPXE(pxe);
  const info = await pxe.getPXEInfo();
  logger.info(JSON.stringify(info));
  const [alice, bob, charlie] = await getInitialTestAccountsWallets(pxe);
  namedWallets = {
    alice,
    bob,
    charlie,
  };
};

export const getNodeVersion = () => {
  if (!version) throw new Error("Version not initialized");
  return version;
}

export const getAztecNodeClient = () => {
  if (!aztecNode) throw new Error("Aztec Node not initialized");
  return aztecNode;
}

export const getPxe = () => {
  if (!pxe) throw new Error("PXE not initialized");
  return pxe;
};

export const getWallets = () => {
  if (!namedWallets) throw new Error("Wallets not initialized");
  return namedWallets;
};
