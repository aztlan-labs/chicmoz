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

  return router;
};
