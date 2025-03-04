import { PublicClient } from "viem";
import { controllers as dbControllers } from "../../svcs/database/index.js";
import { getPublicHttpClient } from "../client.js";
import {
  l2BlockProposedEventCallbacks,
  l2ProofVerifiedEventCallbacks,
} from "./callbacks/rollup.js";
import { AztecContracts } from "./utils.js";

const GET_EVENETS_DEFAULT_IS_FINALIZED = true;

const getRollupL2BlockProposedLogs = async ({
  client,
  contracts,
  toBlock,
  latestHeight,
}: {
  client: PublicClient;
  contracts: AztecContracts;
  toBlock: "finalized";
  latestHeight: bigint;
}) => {
  const { fromBlock, updateHeight, storeHeight } =
    await dbControllers.inMemoryHeightTracker({
      contractName: "rollup",
      contractAddress: contracts.rollup.address,
      eventName: "L2BlockProposed",
      isFinalized: GET_EVENETS_DEFAULT_IS_FINALIZED,
      latestHeight,
    });
  const rollupL2BlockProposedLogs = await client.getContractEvents({
    fromBlock: fromBlock === 1n ? "finalized" : fromBlock,
    toBlock,
    eventName: "L2BlockProposed",
    address: contracts.rollup.address,
    abi: contracts.rollup.abi,
  });
  l2BlockProposedEventCallbacks({
    isFinalized: GET_EVENETS_DEFAULT_IS_FINALIZED,
    updateHeight,
    storeHeight,
  }).onLogs(rollupL2BlockProposedLogs);
};

const getRollupL2ProofVerifiedLogs = async ({
  client,
  contracts,
  toBlock,
  latestHeight,
}: {
  client: PublicClient;
  contracts: AztecContracts;
  toBlock: "finalized";
  latestHeight: bigint;
}) => {
  const { fromBlock, updateHeight, storeHeight } =
    await dbControllers.inMemoryHeightTracker({
      contractName: "rollup",
      contractAddress: contracts.rollup.address,
      eventName: "L2ProofVerified",
      isFinalized: GET_EVENETS_DEFAULT_IS_FINALIZED,
      latestHeight,
    });
  const rollupL2ProofVerifiedLogs = await client.getContractEvents({
    fromBlock: fromBlock === 1n ? "finalized" : fromBlock,
    toBlock,
    eventName: "L2ProofVerified",
    address: contracts.rollup.address,
    abi: contracts.rollup.abi,
  });
  l2ProofVerifiedEventCallbacks({
    isFinalized: GET_EVENETS_DEFAULT_IS_FINALIZED,
    updateHeight,
    storeHeight,
  }).onLogs(rollupL2ProofVerifiedLogs);
};

export const getAllContractsEvents = async ({
  contracts,
  toBlock,
  latestHeight,
}: {
  contracts: AztecContracts;
  toBlock: "finalized";
  latestHeight: bigint;
}) => {
  const client = getPublicHttpClient();
  // TODO: batch-query if genesis-catcup
  await getRollupL2BlockProposedLogs({
    client,
    contracts,
    toBlock,
    latestHeight,
  });
  await getRollupL2ProofVerifiedLogs({
    client,
    contracts,
    toBlock,
    latestHeight,
  });
};
