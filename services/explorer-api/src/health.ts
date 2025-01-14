// TODO: integrate with microservice base
import asyncHandler from "express-async-handler";
import { logger } from "./logger.js";

enum componentState {
  INITIALIZING = "INITIALIZING",
  UP = "UP",
  DOWN = "DOWN",
  SHUTTING_DOWN = "SHUTTING_DOWN",
}

const healthComponents: Record<string, componentState> = {};

export const getHandler = asyncHandler((_req, res) => {
  const components = Object.entries(healthComponents).map(([key, value]) => ({
    key,
    value,
  }));
  const isHealthy = components.every(
    (component) => component.value === componentState.UP
  );
  let isInitializing = false;
  let isShuttingDown = false;
  if (!isHealthy) {
    isInitializing = components.some(
      (component) => component.value === componentState.INITIALIZING
    );
  }
  if (!isHealthy && !isInitializing) {
    isShuttingDown = components.some(
      (component) => component.value === componentState.SHUTTING_DOWN
    );
  }
  const httpStatus = isHealthy
    ? 200
    : isInitializing || isShuttingDown
      ? 503
      : 500;
  res.status(httpStatus).json({
    isInitializing,
    isShuttingDown,
    components,
  });
});

export const setComponentInitializing = (component: string) => {
  healthComponents[component] = componentState.INITIALIZING;
  logger.info(`⏳ ${component}`);
};

export const setComponentUp = (component: string) => {
  healthComponents[component] = componentState.UP;
  logger.info(`✅ ${component}`);
};

export const setComponentDown = (component: string) => {
  healthComponents[component] = componentState.DOWN;
  logger.info(`❌ ${component}`);
};

export const setComponentShuttingDown = (component: string) => {
  healthComponents[component] = componentState.SHUTTING_DOWN;
  logger.info(`💥 Shutting down ${component}`);
};
