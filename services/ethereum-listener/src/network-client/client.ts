import {
  defineChain,
  createPublicClient,
  http,
  PublicClient,
} from "viem";
import {
  ETHEREUM_CHAIN_NAME,
  ETHEREUM_HTTP_RPC_URL,
  ETHEREUM_NETWORK_ID,
  ETHEREUM_WS_RPC_URL,
} from "../environment.js";
import {
  RollupAbi,
  RegistryAbi,
  InboxAbi,
  OutboxAbi,
  //FeeJuiceAbi,
  FeeJuicePortalAbi,
} from "@aztec/l1-artifacts";
import { ConnectedToAztecEvent } from "@chicmoz-pkg/message-registry";
import { EthAddress } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";

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

const chain = defineChain({
  id: ETHEREUM_NETWORK_ID,
  name: ETHEREUM_CHAIN_NAME,
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

let publicClient: PublicClient;

export const initClient = () => {
  publicClient = createPublicClient({
    chain,
    transport: http(),
  });
};

export const initContracts = (
  l1ContractAddresses: ConnectedToAztecEvent["nodeInfo"]["l1ContractAddresses"]
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

export const getContractsEvents = async () => {
  // NOTE: this probably won´t be needed
  if (!l1Contracts) throw new Error("Contracts not initialized");
  for (const [name, contract] of Object.entries(l1Contracts)) {
    const events = await publicClient.getContractEvents({
      address: contract.address,
      abi: contract.abi,
    });
    if (events.length > 0)
      logger.info(`CONTRACT EVENTS! ${name}: ${events.toString()}`);
    else logger.info(`No events for ${name}`);
  }
};

export const queryStakingState = async () => {
  if (!l1Contracts) throw new Error("Contracts not initialized");
  const attesterCount = await publicClient.readContract({
    address: l1Contracts.rollup.address,
    abi: RollupAbi,
    functionName: "getActiveAttesterCount",
  });
  logger.info(`Active attester count: ${attesterCount.toString()}`);
  if (attesterCount > 0) {
    for (let i = 0; i < attesterCount; i++) {
      const attester = await publicClient.readContract({
        address: l1Contracts.rollup.address,
        abi: RollupAbi,
        functionName: "getAttesterAtIndex",
        args: [BigInt(i)],
      });
      logger.info(`Attester ${i}: ${attester.toString()}`);
      const attesterInfo = await publicClient.readContract({
        address: l1Contracts.rollup.address,
        abi: RollupAbi,
        functionName: "getInfo",
        args: [attester],
      });
      logger.info(`Attester ${i} info: ${JSON.stringify({
        ...attesterInfo,
        stake: attesterInfo.stake.toString(),
      })}`);

    }
  }
}
