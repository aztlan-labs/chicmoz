export const aztecExplorer = {
  getL2LatestHeight: "l2/latest-height",
  getL2LatestBlock: "l2/blocks/latest",
  getL2BlockByHash: "l2/blocks/",
  getL2BlockByHeight: "l2/blocks/",
  getL2BlocksByHeightRange: "l2/blocks",
  getL2TxEffectByHash: "l2/tx-effects/",
  getL2TxEffectsByHeight: (height: number) => `l2/blocks/${height}/tx-effects`,
  getL2TxEffectByHeightAndIndex: (height: number, index: number) =>
    `l2/blocks/${height}/txEffects/${index}`,
  getL2TxEffectsByHeightRange: "",
  getL2ContractClassByIdAndVersion: (classId: string, version: string) =>
    `l2/contract-classes/${classId}/versions/${version}`,
  getL2ContractClasses: (classId?: string) =>
    classId ? `l2/contract-classes/${classId}` : "l2/contract-classes",
  getL2ContractClassPrivateFunctions: (
    classId: string,
    functionSelector?: string
  ) =>
    functionSelector
      ? `l2/contract-classes/${classId}/private-functions/${functionSelector}`
      : `l2/contract-classes/${classId}/private-functions`,
  getL2ContractClassUnconstrainedFunctions: (
    classId: string,
    functionSelector?: string
  ) =>
    functionSelector
      ? `l2/contract-classes/${classId}/unconstrained-functions/${functionSelector}`
      : `l2/contract-classes/${classId}/unconstrained-functions`,
  getL2ContractInstance: (address: string) =>
    `l2/contract-instances/${address}`,
  getL2ContractInstances: "l2/contract-instances",
  getL2ContractInstancesByBlockHash: (hash: string) =>
    `l2/blocks/${hash}/contract-instances`,
  getL2ContractInstancesByClassId: (classId: string) =>
    `l2/contract-classes/${classId}/contract-instances`,

  getL2TotalTxEffects: "l2/stats/total-tx-effects",
  getL2TotalTxEffectsLast24h: "/l2/stats/tx-effects-last-24h",
  getL2TotalContracts: "/l2/stats/total-contracts",
  getL2TotalContractsLast24h: "/l2/stats/total-contracts-last-24h",
  getL2AverageFees: "/l2/stats/average-fees",
  getL2AverageBlockTime: "/l2/stats/average-block-time",
  getL2SearchResult: "/l2/search",
};

export const API_URL =
  typeof import.meta.env.VITE_API_URL === "string"
    ? import.meta.env.VITE_API_URL
    : "";
export const WS_URL =
  typeof import.meta.env.VITE_WS_URL === "string"
    ? import.meta.env.VITE_WS_URL
    : "";
export const DISCORD_URL =
  typeof import.meta.env.VITE_DISCORD_URL === "string"
    ? import.meta.env.VITE_DISCORD_URL
    : "";
export const GITHUB_URL =
  typeof import.meta.env.VITE_GITHUB_URL === "string"
    ? import.meta.env.VITE_GITHUB_URL
    : "";
export const X_URL =
  typeof import.meta.env.VITE_X_URL === "string"
    ? import.meta.env.VITE_X_URL
    : "";
