import { PublicClient } from "viem";
import { controllers as dbControllers } from "../../svcs/database/index.js";
import { getPublicClient } from "../client.js";
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
}: {
  client: PublicClient;
  contracts: AztecContracts;
  toBlock: "finalized";
}) => {
  const { fromBlock, updateHeight, storeHeight } =
    await dbControllers.inMemoryHeightTracker({
      contractName: "rollup",
      contractAddress: contracts.rollup.address,
      eventName: "L2BlockProposed",
      isFinalized: GET_EVENETS_DEFAULT_IS_FINALIZED,
    });
  const rollupL2BlockProposedLogs = await client.getContractEvents({
    fromBlock,
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
}: {
  client: PublicClient;
  contracts: AztecContracts;
  toBlock: "finalized";
}) => {
  const { fromBlock, updateHeight, storeHeight } =
    await dbControllers.inMemoryHeightTracker({
      contractName: "rollup",
      contractAddress: contracts.rollup.address,
      eventName: "L2ProofVerified",
      isFinalized: GET_EVENETS_DEFAULT_IS_FINALIZED,
    });
  const rollupL2ProofVerifiedLogs = await client.getContractEvents({
    fromBlock,
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
}: {
  contracts: AztecContracts;
  toBlock: "finalized";
}) => {
  const client = getPublicClient();
  await getRollupL2BlockProposedLogs({ client, contracts, toBlock });
  await getRollupL2ProofVerifiedLogs({ client, contracts, toBlock });
};
