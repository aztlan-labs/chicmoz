import { chicmozSearchQuerySchema, hexStringSchema } from "@chicmoz-pkg/types";
import { z } from "zod";

export const heightOrHash = "heightOrHash";
export const blockHeight = "blockHeight";
export const blockHash = "blockHash";
export const txEffectIndex = "txEffectIndex";
export const txEffectHash = "txEffectHash";
export const address = "address";
export const classId = "classId";
export const version = "version";
export const functionSelector = "functionSelector";

export const paths = {
  latestHeight: "/l2/latest-height",
  latestBlock: "/l2/blocks/latest",
  block: `/l2/blocks/:${heightOrHash}`,
  blocks: "/l2/blocks",

  txEffectsByBlockHeight: `/l2/blocks/:${blockHeight}/tx-effects`,
  txEffectByBlockHeightAndIndex: `/l2/blocks/:${blockHeight}/tx-effects/:${txEffectIndex}`,
  txEffectsByTxEffectHash: `/l2/tx-effects/:${txEffectHash}`,

  txs: "/l2/txs",

  contractClass: `/l2/contract-classes/:${classId}/versions/:${version}`,
  contractClassesByClassId: `/l2/contract-classes/:${classId}`,
  contractClasses: `/l2/contract-classes`,

  contractClassPrivateFunctions: `/l2/contract-classes/:${classId}/private-functions`,
  contractClassPrivateFunction: `/l2/contract-classes/:${classId}/private-functions/:${functionSelector}`,
  contractClassUnconstrainedFunctions: `/l2/contract-classes/:${classId}/unconstrained-functions`,
  contractClassUnconstrainedFunction: `/l2/contract-classes/:${classId}/unconstrained-functions/:${functionSelector}`,

  contractInstancesByContractClassId: `/l2/contract-classes/:${classId}/contract-instances`,
  contractInstancesByBlockHash: `/l2/blocks/:${blockHash}/contract-instances`,
  contractInstance: `/l2/contract-instances/:${address}`,
  contractInstances: "/l2/contract-instances",

  search: "/l2/search",

  verifiedContract: `/l2/verified-contracts/:${address}`,
  verifiedContracts: "/l2/verified-contracts",

  validators: "/l2/validators",

  statsTotalTxEffects: "/l2/stats/total-tx-effects",
  statsTotalTxEffectsLast24h: "/l2/stats/tx-effects-last-24h",
  statsTotalContracts: "/l2/stats/total-contracts",
  statsTotalContractsLast24h: "/l2/stats/total-contracts-last-24h",
  statsAverageFees: "/l2/stats/average-fees",
  statsAverageBlockTime: "/l2/stats/average-block-time",
};

export const getBlockByHeightOrHashSchema = z.object({
  params: z.object({
    [heightOrHash]: hexStringSchema.or(z.coerce.number().nonnegative()),
  }),
});

export const getBlocksSchema = z.object({
  query: z.object({
    from: z.coerce.number().nonnegative().optional(),
    to: z.coerce.number().nonnegative().optional(),
  }),
});

export const getTxEffectsByBlockHeightSchema = z.object({
  params: z.object({
    [blockHeight]: z.coerce.number().nonnegative(),
  }),
});

export const getTxEffectByBlockHeightAndIndexSchema = z.object({
  params: z.object({
    [blockHeight]: z.coerce.number().nonnegative(),
    [txEffectIndex]: z.coerce.number().nonnegative(),
  }),
});

export const getTxEffectsByTxHashSchema = z.object({
  params: z.object({
    [txEffectHash]: hexStringSchema,
  }),
});

export const getContractInstanceSchema = z.object({
  params: z.object({
    [address]: hexStringSchema,
  }),
});

export const getContractInstancesSchema = z.object({
  query: z.object({
    fromHeight: z.coerce.number().nonnegative().optional(),
    toHeight: z.coerce.number().nonnegative().optional(),
  }),
});

export const getContractInstancesByBlockHashSchema = z.object({
  params: z.object({
    [blockHash]: hexStringSchema,
  }),
});

export const getContractClassSchema = z.object({
  params: z.object({
    [classId]: hexStringSchema,
    [version]: z.coerce.number().nonnegative(),
  }),
});

export const getContractClassesByClassIdSchema = z.object({
  params: z.object({
    [classId]: hexStringSchema,
  }),
});

export const getContractClassPrivateFunctionsSchema = getContractClassesByClassIdSchema;
export const getContractClassPrivateFunctionSchema = z.object({
  params: z.object({
    [classId]: hexStringSchema,
    [functionSelector]: z.coerce.number().nonnegative(),
  }),
});
export const getContractClassUnconstrainedFunctionsSchema = getContractClassPrivateFunctionsSchema;
export const getContractClassUnconstrainedFunctionSchema = getContractClassPrivateFunctionSchema;

export const getContractInstancesByContractClassIdSchema =
  getContractClassesByClassIdSchema;

export const getVerifiedContractSchema = getContractInstanceSchema;

export const getSearchSchema = z.object({
  query: chicmozSearchQuerySchema,
});
