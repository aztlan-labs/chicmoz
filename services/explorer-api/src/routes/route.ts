import { Logger } from "@chicmoz-pkg/logger-server";
import express from "express";
import { Controller } from "./controller.js";

export const newRouter = (deps: { logger: Logger }) => {
  const router = express.Router();

  const controller = new Controller(deps);

  router.get(`/health`, controller.GET_HEALTH);

  // router.get(`/latest/block`, controller.GET_LATEST_BLOCK);
  // router.get(`/latest/height`, controller.GET_LATEST_HEIGHT);
  // router.get(`/block/:heightOrHash`, controller.GET_BLOCK);
  // router.get(`/blocks`, controller.GET_BLOCKS);
  return router;
};
