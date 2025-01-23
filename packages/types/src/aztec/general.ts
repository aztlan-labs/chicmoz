import { z } from "zod";
import { l2NetworkIdSchema } from "../network-ids.js";

export const CHICMOZ_TYPES_AZTEC_VERSION = "0.71.0";

export const L1ContractAddressesSchema = z.object({
  rollupAddress: z.string(),
  registryAddress: z.string(),
  inboxAddress: z.string(),
  outboxAddress: z.string(),
  feeJuiceAddress: z.string(),
  feeJuicePortalAddress: z.string(),
  coinIssuerAddress: z.string(),
  rewardDistributorAddress: z.string(),
  governanceProposerAddress: z.string(),
  governanceAddress: z.string(),
  stakingAssetAddress: z.string(),
  slashFactoryAddress: z.string(),
});

export const ProtocolContractAddressesSchema = z.object({
  classRegisterer: z.string(),
  feeJuice: z.string(),
  instanceDeployer: z.string(),
  multiCallEntrypoint: z.string(),
});

export const chicmozChainInfoSchema = z.object({
  l2NetworkId: l2NetworkIdSchema,
  l1ChainId: z.number(),
  protocolVersion: z.number(),
  l1ContractAddresses: L1ContractAddressesSchema,
  protocolContractAddresses: ProtocolContractAddressesSchema,
  createdAt: z.date().optional(),
  latestUpdateAt: z.date().optional(),
});

export type L1ContractAddresses = z.infer<typeof L1ContractAddressesSchema>;
export type ProtocolContractAddresses = z.infer<
  typeof ProtocolContractAddressesSchema
>;
export type ChicmozChainInfo = z.infer<typeof chicmozChainInfoSchema>;

export const nodeInfoSchema = z.object({
  nodeVersion: z.string(),
  l1ChainId: z.number(),
  protocolVersion: z.number(),
  enr: z.string().optional(),
  l1ContractAddresses: L1ContractAddressesSchema,
  protocolContractAddresses: ProtocolContractAddressesSchema,
});

export const chicmozL2RpcNodeSchema = z.object({
  rpcUrl: z.string(),
  id: z.string().optional(),
  createdAt: z.date(),
  lastSeenAt: z.date().optional(),
});

export const chicmozL2RpcNodeErrorSchema = z.object({
  rpcNodeId: z.string().optional(),
  rpcUrl: chicmozL2RpcNodeSchema.shape.rpcUrl.optional(),
  name: z.string(),
  cause: z.string(),
  message: z.string(),
  stack: z.string(),
  data: z.unknown(),
  count: z.number(),
  createdAt: z.date(),
  lastSeenAt: z.date(),
});

export const chicmozL2SequencerSchema = z.object({
  enr: z.string(),
  rpcNodeId: z.string().optional(),
  rpcUrl: z.string().optional(),
  l2NetworkId: l2NetworkIdSchema,
  protocolVersion: z.number(),
  nodeVersion: z.string(),
  l1ChainId: z.number(),
  lastSeenAt: z.date(),
  createdAt: z.date(),
});

export type ChicmozL2RpcNode = z.infer<typeof chicmozL2RpcNodeSchema>;
export type ChicmozL2RpcNodeError = z.infer<typeof chicmozL2RpcNodeErrorSchema>;
export type ChicmozL2Sequencer = z.infer<typeof chicmozL2SequencerSchema>;
