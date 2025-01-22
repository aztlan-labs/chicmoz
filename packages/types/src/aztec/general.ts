import { type NodeInfo as AztecNodeInfo, type NodeInfo } from "@aztec/aztec.js";
import {
  ProtocolContractAddresses,
  ProtocolContractAddressesSchema,
} from "@aztec/circuits.js";
import {
  L1ContractAddresses,
  L1ContractAddressesSchema,
} from "@aztec/ethereum";
import { z } from "zod";
import { L2NetworkId, l2NetworkIdSchema } from "../network-ids.js";

export const chicmozChainInfoSchema = z.object({
  L2NetworkId: l2NetworkIdSchema,
  l1ChainId: z.number(),
  protocolVersion: z.number(),
  l1ContractAddresses: L1ContractAddressesSchema,
  protocolContractAddresses: ProtocolContractAddressesSchema,
  createdAt: z.date().optional(),
  latestUpdateAt: z.date().optional(),
});

export type ChicmozChainInfo = z.infer<typeof chicmozChainInfoSchema>;

export const getChicmozChainInfo = (
  L2NetworkId: L2NetworkId,
  nodeInfo: NodeInfo
): ChicmozChainInfo => {
  const l1ContractAddresses: L1ContractAddresses = nodeInfo.l1ContractAddresses;
  // NOTE: this workaround is needed because the zod schema says they should be strings. But we're getting EthAddress (object) from the aztec.js node-call.
  //   e.g.:   {
  // "code": "invalid_type",
  // "expected": "string",
  // "received": "object",
  // "path": [
  //   "l1ContractAddresses",
  //   "rollupAddress"
  // ],
  // "message": "Expected string, received object"
  const actualCompatibleL1ContractAddresses: L1ContractAddresses =
    Object.fromEntries(
      Object.entries(l1ContractAddresses).map(([key, value]) => [
        key,
        value.toString(),
      ])
    ) as unknown as L1ContractAddresses;
  // NOTE: this workaround is needed because the zod schema says they should be strings. But we're getting EthAddress (object) from the aztec.js node-call.
  //   e.g.:   {
  //  "code": "invalid_type",
  //  "expected": "string",
  //  "received": "object",
  //  "path": [
  //    "protocolContractAddresses",
  //    "multiCallEntrypoint"
  //  ],
  //  "message": "Expected string, received object"

  const actualCompatibleProtocolContractAddresses = Object.fromEntries(
    Object.entries(nodeInfo.protocolContractAddresses).map(([key, value]) => [
      key,
      value.toString(),
    ])
  ) as unknown as ProtocolContractAddresses;
  return chicmozChainInfoSchema.parse({
    L2NetworkId,
    ...nodeInfo,
    l1ContractAddresses: actualCompatibleL1ContractAddresses,
    protocolContractAddresses: actualCompatibleProtocolContractAddresses,
  });
};

export const chicmozL2RpcNodeSchema = z.object({
  rpcUrl: z.string(),
  id: z.string().optional(),
  createdAt: z.date(),
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
export type ChicmozL2Sequencer = z.infer<
  typeof chicmozL2SequencerSchema
>;

export const getSequencer = (
  l2NetworkId: L2NetworkId,
  rpcUrl: string,
  nodeInfo: AztecNodeInfo
): ChicmozL2Sequencer => {
  return chicmozL2SequencerSchema.parse({
    l2NetworkId,
    rpcUrl,
    ...nodeInfo,
  });
};
