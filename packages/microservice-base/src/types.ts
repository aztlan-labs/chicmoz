export type Svc = {
  serviceId: string;
  init: () => Promise<void>;
  health: () => boolean;
  shutdown: () => Promise<void>;
};
// TODO: better name than config
export type MicroserviceConfig = {
  serviceName: string;
  formattedConfig: string;
  services: Svc[];
  startCallback: () => Promise<void>;
};
