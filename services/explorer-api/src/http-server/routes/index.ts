import { Router } from "express";
import * as controller from "./controller.js";
import { routes } from "./routes_and_validation.js";

export const init = ({
  router,
}: {
  router: Router;
}) => {
  router.get(`/health`, controller.GET_HEALTH);
  router.get("/l2/index", controller.GET_ROUTES);

  router.get(routes.latestHeight, controller.GET_LATEST_HEIGHT);
  router.get(routes.latestBlock, controller.GET_LATEST_BLOCK);
  router.get(routes.block, controller.GET_BLOCK);
  router.get(routes.blocks, controller.GET_BLOCKS);

  router.get(routes.txEffectsByBlockHeight, controller.GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT);
  router.get(routes.txEffectByBlockHeightAndIndex, controller.GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX);
  router.get(routes.txEffectsByTxHash, controller.GET_L2_TX_EFFECT_BY_TX_HASH);

  router.get(routes.contractInstancesByBlockHash, controller.GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH);
  router.get(routes.contractInstance, controller.GET_L2_CONTRACT_INSTANCE);

  router.get(routes.statsTotalTxEffects, controller.GET_STATS_TOTAL_TX_EFFECTS);
  router.get(routes.statsTotalTxEffectsLast24h, controller.GET_STATS_TOTAL_TX_EFFECTS_LAST_24H);
  router.get(routes.statsTotalContracts, controller.GET_STATS_TOTAL_CONTRACTS);
  router.get(routes.statsAverageFees, controller.GET_STATS_AVERAGE_FEES);
  router.get(routes.statsAverageBlockTime, controller.GET_STATS_AVERAGE_BLOCK_TIME);

  return router;
};
