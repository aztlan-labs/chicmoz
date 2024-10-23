export const statsKey = "stats";
export const queryKeyGenerator = {
  txEffectsByBlockHeight: (height: number) => [
    "txEffectsByBlockHeight",
    height,
  ],
  txEffectByHash: (hash: string) => ["txEffectByHash", hash],
  latestBlock: ["latestBlock"],
  latestBlocks: ["latestBlocks"],
  blockByHeight: (height: string) => ["blockByHeight", height],
  totalTxEffects: [statsKey, "totalTxEffects"],
  totalTxEffectsLast24h: [statsKey, "totalTxEffectsLast24h"],
  totalContracts: [statsKey, "totalContracts"],
  totalContractsLast24h: [statsKey, "totalContractsLast24h"],
  averageFees: [statsKey, "averageFees"],
  averageBlockTime: [statsKey, "averageBlockTime"],
};
