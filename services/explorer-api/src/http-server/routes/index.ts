import { Router } from "express";
import * as controller from "./controllers/index.js";
import { paths } from "./paths_and_validation.js";

export const openApiPaths = {
  ...controller.openapi_GET_LATEST_HEIGHT,
  ...controller.openapi_GET_LATEST_BLOCK,
  ...controller.openapi_GET_BLOCK,
  ...controller.openapi_GET_BLOCKS,
  ...controller.openapi_GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT,
  ...controller.openapi_GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX,
  ...controller.openapi_GET_L2_TX_EFFECT_BY_TX_HASH,
  ...controller.openapi_GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH,
  ...controller.openapi_GET_L2_CONTRACT_INSTANCE,
  ...controller.openapi_GET_L2_CONTRACT_INSTANCES,
};

export const init = ({ router }: { router: Router }) => {
  router.get("/l2/index", controller.GET_ROUTES);

  router.get(paths.latestHeight, controller.GET_LATEST_HEIGHT);
  router.get(paths.latestBlock, controller.GET_LATEST_BLOCK);
  router.get(paths.block, controller.GET_BLOCK);
  router.get(paths.blocks, controller.GET_BLOCKS);

  router.get(paths.txEffectsByBlockHeight, controller.GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT);
  router.get(paths.txEffectByBlockHeightAndIndex, controller.GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX);
  router.get(paths.txEffectsByTxHash, controller.GET_L2_TX_EFFECT_BY_TX_HASH);

  router.get(paths.contractClass, controller.GET_L2_REGISTERED_CONTRACT_CLASS);
  router.get(paths.contractClassesByClassId, controller.GET_L2_REGISTERED_CONTRACT_CLASSES_ALL_VERSIONS);
  router.get(paths.contractClasses, controller.GET_L2_REGISTERED_CONTRACT_CLASSES);

  router.get(paths.contractInstancesByBlockHash, controller.GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH);
  router.get(paths.contractInstancesByContractClassId, controller.GET_L2_CONTRACT_INSTANCES_BY_CONTRACT_CLASS_ID);
  router.get(paths.contractInstance, controller.GET_L2_CONTRACT_INSTANCE);
  router.get(paths.contractInstances, controller.GET_L2_CONTRACT_INSTANCES);

  router.get(paths.search, controller.L2_SEARCH);

  router.get(paths.statsTotalTxEffects, controller.GET_STATS_TOTAL_TX_EFFECTS);
  router.get(paths.statsTotalTxEffectsLast24h, controller.GET_STATS_TOTAL_TX_EFFECTS_LAST_24H);
  router.get(paths.statsTotalContracts, controller.GET_STATS_TOTAL_CONTRACTS);
  router.get(paths.statsAverageFees, controller.GET_STATS_AVERAGE_FEES);
  router.get(paths.statsAverageBlockTime, controller.GET_STATS_AVERAGE_BLOCK_TIME);

  return router;
};
