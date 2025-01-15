import {
  //FeeJuiceAbi,
  FeeJuicePortalAbi,
  InboxAbi,
  OutboxAbi,
  RegistryAbi,
  RollupAbi,
} from "@aztec/l1-artifacts";
import { ConnectedToL2Event } from "@chicmoz-pkg/message-registry";
import {
  EthAddress,
  chicmozL1L2ValidatorSchema,
  getEthereumNetworkNumber,
  getL1NetworkId,
} from "@chicmoz-pkg/types";
import { Log, PublicClient, createPublicClient, defineChain, http } from "viem";
import {
  ETHEREUM_HTTP_RPC_URL,
  ETHEREUM_WS_RPC_URL,
  L2_NETWORK_ID,
} from "../environment.js";
import { emit } from "../events/index.js";
import { logger } from "../logger.js";

type AztecAbi =
  | typeof RollupAbi
  | typeof RegistryAbi
  | typeof InboxAbi
  | typeof OutboxAbi
  //| typeof FeeJuiceAbi
  | typeof FeeJuicePortalAbi;

let l1Contracts:
  | {
      rollup: {
        address: EthAddress;
        abi: typeof RollupAbi;
      };
      registry: {
        address: EthAddress;
        abi: typeof RegistryAbi;
      };
      inbox: {
        address: EthAddress;
        abi: typeof InboxAbi;
      };
      outbox: {
        address: EthAddress;
        abi: typeof OutboxAbi;
      };
      //feeJuice: {
      //  address: EthAddress;
      //  abi: typeof FeeJuiceAbi;
      //},
      feeJuicePortal: {
        address: EthAddress;
        abi: typeof FeeJuicePortalAbi;
      };
    }
  | undefined = undefined;

let publicClient: PublicClient;

export const initClient = () => {
  const chain = defineChain({
    id: getEthereumNetworkNumber(getL1NetworkId(L2_NETWORK_ID)),
    name: getL1NetworkId(L2_NETWORK_ID),
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    rpcUrls: {
      default: {
        http: [ETHEREUM_HTTP_RPC_URL],
        webSocket: [ETHEREUM_WS_RPC_URL],
      },
    },
  });
  publicClient = createPublicClient({
    chain,
    transport: http(),
  });
};

export const initContracts = (
  l1ContractAddresses: ConnectedToL2Event["nodeInfo"]["l1ContractAddresses"]
) => {
  // TODO: should use watch instead of "poller"
  //publicClient.watchContractEvent
  l1Contracts = {
    rollup: {
      address: l1ContractAddresses.rollupAddress,
      abi: RollupAbi,
    },
    registry: {
      address: l1ContractAddresses.registryAddress,
      abi: RegistryAbi,
    },
    inbox: {
      address: l1ContractAddresses.inboxAddress,
      abi: InboxAbi,
    },
    outbox: {
      address: l1ContractAddresses.outboxAddress,
      abi: OutboxAbi,
    },
    //feeJuice: {
    //  address: l1ContractAddresses.feeJuiceAddress,
    //  abi: FeeJuiceAbi,
    //},
    feeJuicePortal: {
      address: l1ContractAddresses.feeJuicePortalAddress,
      abi: FeeJuicePortalAbi,
    },
  };
};

export const getLatestHeight = async () => {
  return await publicClient.getBlockNumber();
};

export const getBlock = async (blockNumber: number) => {
  return await publicClient.getBlock({
    blockNumber: BigInt(blockNumber),
  });
};

const watchContractEvents = ({
  name,
  address,
  abi,
  cb,
}: {
  name: string;
  address: EthAddress;
  abi: AztecAbi;
  cb: (event: Log) => Promise<unknown>;
}) => {
  return publicClient.watchContractEvent({
    // TODO: fix these type-casts in a better way
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    address: address as `0x${string}`,
    abi,
    onLogs: (logs) => {
      for (const log of logs) {
        cb(log).catch((e) => {
          logger.error(
            `Callback function for ${name.toUpperCase()} failed: ${
              (e as Error).stack
            }`
          );
        });
      }
    },
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

const isStakingEvent = (event: Log) => {
  const eventName = (event as unknown as { eventName: string })?.eventName;
  return (
    eventName === "Deposit" ||
    eventName === "WithdrawInitiated" ||
    eventName === "WithdrawFinalised" ||
    eventName === "Slashed"
  );
};

export const watchContractsEvents = () => {
  if (!l1Contracts) throw new Error("Contracts not initialized");
  const unwatches = Object.entries(l1Contracts).map(
    ([name, { address, abi }]) => {
      return watchContractEvents({
        name,
        address,
        abi,
        // eslint-disable-next-line @typescript-eslint/require-await
        cb: async (event) => {
          if (isStakingEvent(event))
            logger.info("================= STAKING EVENT =================");

          logger.info(
            `${name.toUpperCase()} at block ${event.blockNumber
              ?.valueOf()
              .toString()}\n${json(event)}`
          );
        },
      });
    }
  );
  return () => {
    unwatches.forEach((unwatch) => unwatch());
  };
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
  if (!l1Contracts) throw new Error("Contracts not initialized");
  const attesterCount = await publicClient.readContract({
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    address: l1Contracts.rollup.address as `0x${string}`,
    abi: RollupAbi,
    functionName: "getActiveAttesterCount",
  });
  logger.info(`Active attester count: ${attesterCount.toString()}`);
  if (attesterCount > 0) {
    for (let i = 0; i < attesterCount; i++) {
      const attester = await publicClient.readContract({
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        address: l1Contracts.rollup.address as `0x${string}`,
        abi: RollupAbi,
        functionName: "getAttesterAtIndex",
        args: [BigInt(i)],
      });
      const attesterInfo = await publicClient.readContract({
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
