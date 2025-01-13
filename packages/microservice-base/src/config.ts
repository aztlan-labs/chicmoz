import { MicroserviceConfig } from "types.js";

export let conf: MicroserviceConfig;

export const setConfig = (config: MicroserviceConfig) => {
  conf = config;
};
