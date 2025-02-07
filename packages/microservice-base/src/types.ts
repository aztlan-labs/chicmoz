import { type Logger } from "@chicmoz-pkg/logger-server";
import { L2NetworkId } from "@chicmoz-pkg/types";

export enum MicroserviceBaseSvcState {
  INITIALIZING,
  UP,
  DOWN,
  SHUTTING_DOWN,
}
export type MicroserviceBaseSvc = {
  svcId: string;
  getConfigStr: () => string;
  init: (l2NetworkId?: L2NetworkId) => Promise<void>;
  health: () => boolean;
  shutdown: () => Promise<void>;
};
// TODO: better name than config
export type MicroserviceConfig = {
  serviceName: string;
  logger: Logger;
  formattedConfig: string;
  services: MicroserviceBaseSvc[];
  startCallback: () => Promise<void>;
};
