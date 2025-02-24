import { MicroserviceBaseSvc } from "@chicmoz-pkg/microservice-base";
import {
  ETHEREUM_HTTP_RPC_URL,
  ETHEREUM_WS_RPC_URL,
} from "../../environment.js";
import { logger } from "../../logger.js";
import { init } from "../../network-client/index.js";

export const ethereumNetworkClientService: MicroserviceBaseSvc = {
  svcId: "EthereuemNetworkClient",
  health: () => true,
  init,
  // eslint-disable-next-line @typescript-eslint/require-await
  shutdown: async () => {
    logger.warn("ETH: shutdown nothing to shutdown!");
  },
  getConfigStr: () =>
    `Ethereum Network Client
HTTP_RPC_URL: ${ETHEREUM_HTTP_RPC_URL}
WS_RPC_URL: ${ETHEREUM_WS_RPC_URL}`,
};
