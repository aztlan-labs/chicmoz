import { type NodeInfo } from "@aztec/aztec.js";
import { ProtocolContractsNames } from "@aztec/circuits.js";
import { L1ContractsNames } from "@aztec/ethereum";
import { z } from "zod";
import { L2NetworkId, l2NetworkIdSchema } from "../network-ids.js";

export const chicmozChainInfoSchema = z.object({
  l2NetworkId: l2NetworkIdSchema,
  l1ChainId: z.number(),
  protocolVersion: z.number(),
  //l1ContractAddresses: L1ContractAddressesSchema,
  l1ContractAddresses: z.object({
    ...Object.fromEntries(L1ContractsNames.map((name) => [name, z.string()])),
  }),
  //protocolContractAddresses: ProtocolContractAddressesSchema,
  protocolContractAddresses: z.object({
    ...Object.fromEntries(
      ProtocolContractsNames.map((name) => [name, z.string()])
    ),
  }),
  createdAt: z.date().optional(),
  latestUpdateAt: z.date().optional(),
});

export type ChicmozChainInfo = z.infer<typeof chicmozChainInfoSchema>;

export const getChicmozChainInfo = (
  l2NetworkId: L2NetworkId,
  nodeInfo: NodeInfo
): ChicmozChainInfo => {
  return chicmozChainInfoSchema.parse({
    l2NetworkId,
    ...JSON.parse(JSON.stringify(nodeInfo)),
  });
};

export const chicmozL2RpcNodeSchema = z.object({
  rpcUrl: z.string(),
  id: z.string().optional(),
  createdAt: z.date(),
  lastSeenAt: z.date(),
});

export const chicmozL2RpcNodeErrorSchema = z.object({
  rpcUrl: chicmozL2RpcNodeSchema.shape.rpcUrl,
  name: z.string(),
  cause: z.string(),
  message: z.string(),
  stack: z.string(),
  data: z.unknown(),
  count: z.number(),
  createdAt: z.date(),
});

export const chicmozL2SequencerSchema = z.object({
  enr: z.string(),
  rpcUrl: z.string(),
  l2NetworkId: l2NetworkIdSchema,
  protocolVersion: z.number(),
  nodeVersion: z.string(),
  l1ChainId: z.number(),
  lastSeenAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export type ChicmozL2RpcNode = z.infer<typeof chicmozL2RpcNodeSchema>;
export type ChicmozL2RpcNodeError = z.infer<typeof chicmozL2RpcNodeErrorSchema>;
export type ChicmozL2Sequencer = z.infer<typeof chicmozL2SequencerSchema>;

export const getSequencer = (
  l2NetworkId: L2NetworkId,
  rpcUrl: string,
  nodeInfo: NodeInfo
): ChicmozL2Sequencer => {
  return chicmozL2SequencerSchema.parse({
    l2NetworkId,
    rpcUrl,
    ...JSON.parse(JSON.stringify(nodeInfo)),
  });
};
