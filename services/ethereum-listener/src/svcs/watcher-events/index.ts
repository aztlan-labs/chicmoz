import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import { watchContractsEvents } from "../../network-client/index.js";

let started = false;
let unwatchAllContracts: (() => void) | undefined;

export const refreshWatchers = async () => {
  await stopWatchers();
  unwatchAllContracts = await watchContractsEvents();
};

export const tryStartWatchers = async () => {
  if (started) return;
  unwatchAllContracts = await watchContractsEvents();
  started = true;
};

// eslint-disable-next-line @typescript-eslint/require-await
const stopWatchers = async () => {
  if (unwatchAllContracts) {
    unwatchAllContracts();
    unwatchAllContracts = undefined;
  }
};

export const eventsWatcher: MicroserviceBaseSvc = {
  svcId: "eventsWatcher",
  init: tryStartWatchers,
  shutdown: stopWatchers,
  health: () => true,
  getConfigStr: () => `N/A`,
};
