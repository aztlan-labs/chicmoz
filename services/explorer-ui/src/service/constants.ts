// TODO: update url values
export const aztecExplorer = {
  getL2LatestHeight: "l2/latest-height",
  getL2LatestBlock: "l2/blocks/latest",
  getL2BlockByHash: "l2/blocks/",
  getL2BlockByHeight: "l2/blocks/",
  getL2BlocksByHeightRange: "",
  getL2TxEffectById: "",
  getL2TxEffectsByHeight: (height: number) => `l2/blocks/${height}/txEffects`,
  getL2TxEffectByHeightAndIndex: (height: number, index: number) =>
    `l2/blocks/${height}/txEffects/${index}`,
  getL2TxEffectsByHeightRange: "",
  getL2ContractInstance: "l2/contract-instance/",
  getL2ContractInstancesByBlockHash: (hash: string) =>
    `l2/blocks/${hash}/contract-instances`,
};

export const API_URL = import.meta.env.VITE_API_URL;
