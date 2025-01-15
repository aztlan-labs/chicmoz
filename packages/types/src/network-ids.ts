import { z } from "zod";

export const l2NetworkIdSchema = z.enum([
  "MAINNET",
  "SANDBOX",
  "DEVNET",
  "SP_TESTNET",
  "PUBLIC_TESTNET",
]);
export type L2NetworkId = z.infer<typeof l2NetworkIdSchema>;
export const l1NetworkIdSchema = z.enum([
  "ETH_MAINNET",
  "ANVIL_LOCAL",
  "ANVIL_DEVNET",
  "ANVIL_SP_TESTNET",
  "ETH_SEPOLIA",
]);
export type L1NetworkId = z.infer<typeof l1NetworkIdSchema>;

export const getL1NetworkId = (networkId: L2NetworkId): L1NetworkId => {
  switch (networkId) {
    case "MAINNET":
      return "ETH_MAINNET";
    case "SANDBOX":
      return "ANVIL_LOCAL";
    case "DEVNET":
      return "ANVIL_DEVNET";
    case "SP_TESTNET":
      return "ANVIL_SP_TESTNET";
    case "PUBLIC_TESTNET":
      return "ETH_SEPOLIA";
  }
};
export const getL2NetworkId = (networkId: L1NetworkId): L2NetworkId => {
  switch (networkId) {
    case "ETH_MAINNET":
      return "MAINNET";
    case "ANVIL_LOCAL":
      return "SANDBOX";
    case "ANVIL_DEVNET":
      return "DEVNET";
    case "ANVIL_SP_TESTNET":
      return "SP_TESTNET";
    case "ETH_SEPOLIA":
      return "PUBLIC_TESTNET";
  }
};
export const getEthereumNetworkIdentifier = (
  networkId: L1NetworkId
): number => {
  switch (networkId) {
    case "ETH_MAINNET":
      return 1;
    case "ANVIL_LOCAL":
      return 31337;
    case "ANVIL_DEVNET":
      return 1337;
    case "ANVIL_SP_TESTNET":
      return 1337;
    case "ETH_SEPOLIA":
      // eslint-disable-next-line no-console
      console.log(`================
      trying to get identifier for ETH_SEPOLIA returning 42 but not sure if this is correct
================`);
      return 42;
  }
};
