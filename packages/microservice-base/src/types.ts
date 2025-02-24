import { type Logger } from "@chicmoz-pkg/logger-server";

export enum MicroserviceBaseSvcState {
  INITIALIZING,
  UP,
  DOWN,
  SHUTTING_DOWN,
}
export type MicroserviceBaseSvc = {
  svcId: string;
  getConfigStr: () => string;
  init: () => Promise<void>;
  postInit?: () => Promise<void>;
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
