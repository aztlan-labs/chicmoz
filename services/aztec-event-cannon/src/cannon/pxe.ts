import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import {
  AccountWallet,
  PXE,
  createPXEClient,
  waitForPXE,
} from "@aztec/aztec.js";
import { AZTEC_RPC_URL } from "../environment.js";
import { logger } from "../logger.js";

let pxe: PXE;
let namedWallets: {
  defaultDeployer: AccountWallet,
  alice: AccountWallet,
  bob: AccountWallet,
} | null = null;

export const setup = async () => {
  const { PXE_URL = AZTEC_RPC_URL } = process.env;
  pxe = createPXEClient(PXE_URL);
  await waitForPXE(pxe);
  const info = await pxe.getPXEInfo();
  logger.info(JSON.stringify(info));
  const [
    defaultDeployer,
    alice,
    bob,
  ] = await getInitialTestAccountsWallets(pxe);
  namedWallets = {
    defaultDeployer,
    alice,
    bob
  };
  // logger.info(`Wallets: ${JSON.stringify(namedWallets)}`); WARNING: calling this will throw an error (after a while!)
};

export const getPxe = () => {
  if (!pxe) throw new Error("PXE not initialized");
  return pxe;
};

export const getWallets = () => {
  if (!namedWallets) throw new Error("Wallets not initialized");
  return namedWallets;
}
