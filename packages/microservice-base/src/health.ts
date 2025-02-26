import { Logger } from "@chicmoz-pkg/logger-server";
import { MicroserviceBaseSvcState } from "./types.js";

const svcsStates: Record<string, MicroserviceBaseSvcState> = {};

let logger: Logger;

export const setLogger = (newLogger: Logger) => {
  logger = newLogger;
};

export const setSvcState = (svcId: string, state: MicroserviceBaseSvcState) => {
  svcsStates[svcId] = state;
  switch (state) {
    case MicroserviceBaseSvcState.INITIALIZING:
      break;
    case MicroserviceBaseSvcState.UP:
      logger.info(`✅ ${svcId} is up`);
      break;
    case MicroserviceBaseSvcState.DOWN:
      logger.info(`❌ ${svcId} is down`);
      break;
    case MicroserviceBaseSvcState.SHUTTING_DOWN:
      logger.info(`💥 ${svcId} is shutting down...`);
      break;
  }
};

export const getSvcState = (svcId: string) => {
  if (!svcsStates[svcId]) {
    throw new Error(`Service ${svcId} not found`);
  }
  return svcsStates[svcId];
};

export const getMicroserviceState = () => svcsStates;
