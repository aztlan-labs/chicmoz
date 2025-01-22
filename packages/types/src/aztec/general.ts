import { type NodeInfo as AztecNodeInfo, type NodeInfo } from "@aztec/aztec.js";
import { ProtocolContractAddressesSchema } from "@aztec/circuits.js";
import { L1ContractAddressesSchema } from "@aztec/ethereum";
import { z } from "zod";
import { L2NetworkId, l2NetworkIdSchema } from "../network-ids.js";

export const chicmozChainInfoSchema = z.object({
  L2NetworkId: l2NetworkIdSchema,
  l1ChainId: z.number(),
  protocolVersion: z.string(),
  l1ContractAddresses: L1ContractAddressesSchema,
  protocolContractAddresses: ProtocolContractAddressesSchema,
});

export type ChicmozChainInfo = z.infer<typeof chicmozChainInfoSchema>;

export const getChicmozChainInfo = (
  L2NetworkId: L2NetworkId,
  nodeInfo: NodeInfo
): ChicmozChainInfo => {
  return {
    L2NetworkId,
    l1ChainId: nodeInfo.l1ChainId,
    protocolVersion: nodeInfo.protocolVersion.toString(),
    l1ContractAddresses: nodeInfo.l1ContractAddresses,
    protocolContractAddresses: nodeInfo.protocolContractAddresses,
  };
};

export const chicmozL2RpcNodeSchema = z.object({
  rpcUrl: z.string(),
  id: z.string().optional(),
  createdAt: z.date(),
});

export const chicmozL2RpcNodeErrorSchema = z.object({
  message: z.string(),
  nodeId: chicmozL2RpcNodeSchema.shape.id,
  stack: z.string(),
  data: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export const chicmozL2SequencerInfoSchema = z.object({
  enr: z.string(),
  nodeId: chicmozL2RpcNodeSchema.shape.id.optional(),
  rpcUrl: z.string(),
  l2NetworkId: l2NetworkIdSchema,
  protocolVersion: z.number(),
  nodeVersion: z.string(),
  l1ChainId: z.number(),
  lastSeenAt: z.date().optional(),
  createdAt: z.date().optional(),
});

export type ChicmozL2RpcNodeInfo = z.infer<typeof chicmozL2RpcNodeSchema>;
export type ChicmozL2RpcNodeError = z.infer<typeof chicmozL2RpcNodeErrorSchema>;
export type ChicmozL2SequencerInfo = z.infer<
  typeof chicmozL2SequencerInfoSchema
>;

export const getSequencerInfo = (
  rpcUrl: string,
  l2NetworkId: L2NetworkId,
  nodeInfo: AztecNodeInfo
): ChicmozL2SequencerInfo => {
  return chicmozL2SequencerInfoSchema.parse({
    rpcUrl,
    l2NetworkId,
    ...nodeInfo,
  });
};
