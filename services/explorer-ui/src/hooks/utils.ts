export const queryKeyGenerator = {
  txEffectsByBlockHeight: (height: number) => [
    "txEffectsByBlockHeight",
    height,
  ],
  txEffectByHash: (hash: string) => ["txEffectByHash", hash],
  latestBlock: ["latestBlock"],
  latestBlocks: ["latestBlocks"],
  blockByHeight: (height: string) => ["blockByHeight", height],
};
