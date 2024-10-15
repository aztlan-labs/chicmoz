export const aztecExplorer = {
  getL2LatestHeight: "l2/latest-height",
  getL2LatestBlock: "l2/blocks/latest",
  getL2BlockByHash: "l2/blocks/",
  getL2BlockByHeight: "l2/blocks/",
  getL2BlocksByHeightRange: "l2/blocks",
  getL2TxEffectByHash: "l2/txEffects/",
  getL2TxEffectsByHeight: (height: number) => `l2/blocks/${height}/txEffects`,
  getL2TxEffectByHeightAndIndex: (height: number, index: number) =>
    `l2/blocks/${height}/txEffects/${index}`,
  getL2TxEffectsByHeightRange: "",
  getL2ContractClassByIdAndVersion: (classId: string, version: string) => `l2/contract-classes/${classId}/${version}`,
  getL2ContractClasses: (classId?: string) => classId ? `l2/contract-classes/${classId}` : "l2/contract-classes",
  getL2ContractInstance: (address: string) => `l2/contract-instances/${address}`,
  getL2ContractInstances: "l2/contract-instances",
  getL2ContractInstancesByBlockHash: (hash: string) =>
    `l2/blocks/${hash}/contract-instances`,
  getL2ContractInstancesByClassId: (classId: string) =>
    `l2/contract-classes/${classId}/contract-instances`,

  getL2TotalTxEffects: "l2/stats/total-tx-effects",
  getL2TotalTxEffectsLast24h: "/l2/stats/tx-effects-last-24h",
  getL2TotalContracts: "/l2/stats/total-contracts",
  getL2AverageFees: "/l2/stats/average-fees",
  getL2AverageBlockTime: "/l2/stats/average-block-time",
};

export const API_URL = import.meta.env.VITE_API_URL;
export const WS_URL = import.meta.env.VITE_WS_URL;
