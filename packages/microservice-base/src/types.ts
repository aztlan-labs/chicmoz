import { type Logger } from "@chicmoz-pkg/logger-server";

export type MicroserviceBaseSvc = {
  serviceId: string;
  init: () => Promise<void>;
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
