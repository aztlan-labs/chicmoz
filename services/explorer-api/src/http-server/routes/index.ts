import { Router } from "express";
import * as controller from "./controller.js";

export const init = ({
  router,
}: {
  router: Router;
}) => {
  router.get(`/health`, controller.GET_HEALTH);

  router.get(`/l2/latest-height`, controller.GET_LATEST_HEIGHT);
  router.get(`/l2/blocks/latest`, controller.GET_LATEST_BLOCK);
  router.get(`/l2/blocks/:heightOrHash`, controller.GET_BLOCK);
  // router.get(`/blocks`, controller.GET_BLOCKS);

  router.get(`/l2/blocks/:blockHeight/txEffects`, controller.GET_L2_TX_EFFECTS_BY_BLOCK_HEIGHT);
  router.get(`/l2/blocks/:blockHeight/txEffects/:txEffectIndex`, controller.GET_L2_TX_EFFECT_BY_BLOCK_HEIGHT_AND_INDEX);

  router.get(`/l2/contract-instance/:address`, controller.GET_L2_CONTRACT_INSTANCE);
  router.get(`/l2/blocks/:blockHash/contract-instances`, controller.GET_L2_CONTRACT_INSTANCES_BY_BLOCK_HASH);
  return router;
};
