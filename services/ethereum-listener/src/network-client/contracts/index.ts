import {
  FeeJuicePortalAbi,
  InboxAbi,
  OutboxAbi,
  RegistryAbi,
  RollupAbi,
} from "@aztec/l1-artifacts";
import { controllers as dbControllers } from "../../svcs/database/index.js";
import { getPublicClient } from "../client.js";
import { getAllContractsEvents } from "./get-events.js";
import { AztecContracts, UnwatchCallback, getTypedContract } from "./utils.js";
import { watchAllContractsEvents } from "./watch-events.js";

export const getL1Contracts = async (): Promise<AztecContracts> => {
  const dbContracts = await dbControllers.getL1Contracts();
  const publicClient = getPublicClient();
  return {
    rollup: getTypedContract(
      RollupAbi,
      dbContracts.rollupAddress as `0x${string}`,
      publicClient
    ),
    registry: getTypedContract(
      RegistryAbi,
      dbContracts.registryAddress as `0x${string}`,
      publicClient
    ),
    inbox: getTypedContract(
      InboxAbi,
      dbContracts.inboxAddress as `0x${string}`,
      publicClient
    ),
    outbox: getTypedContract(
      OutboxAbi,
      dbContracts.outboxAddress as `0x${string}`,
      publicClient
    ),
    feeJuicePortal: getTypedContract(
      FeeJuicePortalAbi,
      dbContracts.feeJuiceAddress as `0x${string}`,
      publicClient
    ),
  };
};

export const startContractWatchers = async (): Promise<UnwatchCallback> => {
  const contracts = await getL1Contracts();
  return watchAllContractsEvents({ contracts });
};

export const getFinalizedContractEvents = async () => {
  const contracts = await getL1Contracts();
  return getAllContractsEvents({ contracts, toBlock: "finalized" });
};
