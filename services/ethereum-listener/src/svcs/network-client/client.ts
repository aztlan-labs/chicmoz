import { RollupAbi } from "@aztec/l1-artifacts";
import {
  ChicmozChainInfo,
  chicmozL1L2ValidatorSchema,
  getL1NetworkId,
} from "@chicmoz-pkg/types";
import { PublicClient, createPublicClient, defineChain, webSocket } from "viem";
import { foundry, mainnet, sepolia } from "viem/chains";
import {
  ETHEREUM_HTTP_RPC_URL,
  ETHEREUM_WS_RPC_URL,
  L2_NETWORK_ID,
} from "../../environment.js";
import { emit } from "../../events/index.js";
import { logger } from "../../logger.js";
import { getL1Contracts, init as initC } from "./contracts/index.js";
export { watchContractsEvents } from "./contracts/index.js";

let publicClient: PublicClient | undefined = undefined;

export const initContracts = (
  l1ContractAddresses: ChicmozChainInfo["l1ContractAddresses"]
) => {
  initC(l1ContractAddresses, getPublicClient());
};

const getPublicClient = () => {
  if (!publicClient) throw new Error("Client not initialized");
  return publicClient;
};

export const initClient = () => {
  let chainConf;
  switch (getL1NetworkId(L2_NETWORK_ID)) {
    case "ETH_MAINNET":
      chainConf = mainnet;
      break;
    case "ETH_SEPOLIA":
      chainConf = sepolia;
      break;
    default:
      chainConf = foundry;
  }
  const chain = defineChain({
    ...chainConf,
    rpcUrls: {
      default: {
        http: [ETHEREUM_HTTP_RPC_URL],
        webSocket: [ETHEREUM_WS_RPC_URL],
      },
    },
  });
  publicClient = createPublicClient({
    chain,
    transport: webSocket(),
  });
};

export const getLatestHeight = async () => {
  return await getPublicClient().getBlockNumber();
};

export const getBlock = async (blockNumber: number) => {
  return await getPublicClient().getBlock({
    blockNumber: BigInt(blockNumber),
  });
};

const json = (param: unknown): string => {
  return JSON.stringify(
    param,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2
  );
};

//export const emitRandomizedChangeWithinRandomizedTime = async (
//  depth: number,
//  oldValues: ChicmozL1L2Validator
//) => {
//  if (depth === 0) return;
//  const rand = Math.random();
//  const sleepTime = 30000;
//  logger.info(
//    `ATTESTER ${oldValues.attester} - DEPTH ${depth} - SLEEP ${sleepTime / 1000}s`
//  );
//  await new Promise((resolve) => setTimeout(resolve, sleepTime));
//  let newValues = oldValues;
//  if (rand < 0.25) {
//    const stake = BigInt(Math.floor(Math.random() * 100000000));
//    logger.info(`STAKE CHANGED: ${oldValues.stake} -> ${stake}`);
//    newValues = {
//      ...oldValues,
//      stake,
//      latestSeenChangeAt: new Date(),
//    };
//  } else if (rand < 0.5) {
//    const status = [0, 1, 2, 3][Math.floor(Math.random() * 4)];
//    logger.info(`STATUS CHANGED: ${oldValues.status} -> ${status}`);
//    newValues = {
//      ...oldValues,
//      status,
//      latestSeenChangeAt: new Date(),
//    };
//  } else if (rand < 0.75) {
//    const withdrawer = oldValues.withdrawer
//      .slice(0, -Math.floor(rand * 5))
//      .padEnd(42, ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)]);
//    logger.info(`WITHDRAWER CHANGED: ${oldValues.withdrawer} -> ${withdrawer}`);
//    newValues = {
//      ...oldValues,
//      withdrawer,
//      latestSeenChangeAt: new Date(),
//    };
//  } else {
//    const proposer = oldValues.proposer
//      .slice(0, -Math.floor(rand * 5))
//      .padEnd(42, ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)]);
//    logger.info(`PROPOSER CHANGED: ${oldValues.proposer} -> ${proposer}`);
//    newValues = {
//      ...oldValues,
//      proposer,
//      latestSeenChangeAt: new Date(),
//    };
//  }
//  await emit.l1Validator(newValues);
//  await emitRandomizedChangeWithinRandomizedTime(depth - 1, newValues);
//};

export const queryStakingStateAndEmitUpdates = async () => {
  // TODO: this entire function should be replaced with a watch on the contract (and some initial state query)
  const l1Contracts = getL1Contracts();
  if (!l1Contracts) throw new Error("Contracts not initialized");
  const attesterCount = await getPublicClient().readContract({
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    address: l1Contracts.rollup.address as `0x${string}`,
    abi: RollupAbi,
    functionName: "getActiveAttesterCount",
  });
  logger.info(`Active attester count: ${attesterCount.toString()}`);
  if (attesterCount > 0) {
    for (let i = 0; i < attesterCount; i++) {
      const attester = await getPublicClient().readContract({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        address: l1Contracts.rollup.address as `0x${string}`,
        abi: RollupAbi,
        functionName: "getAttesterAtIndex",
        args: [BigInt(i)],
      });
      const attesterInfo = await getPublicClient().readContract({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        address: l1Contracts.rollup.address as `0x${string}`,
        abi: RollupAbi,
        functionName: "getInfo",
        args: [attester],
      });
      logger.info(`Attester ${i}: ${json(attesterInfo)}`);
      await emit.l1Validator(
        chicmozL1L2ValidatorSchema.parse({
          ...attesterInfo,
          attester,
        })
      );
      //await emitRandomizedChangeWithinRandomizedTime(
      //  100,
      //  chicmozL1L2ValidatorSchema.parse({
      //    ...attesterInfo,
      //    attester,
      //  })
      //).catch((e) => {
      //  logger.error(
      //    `Randomized change emission failed: ${(e as Error).stack}`
      //  );
      //});
    }
  }
};
