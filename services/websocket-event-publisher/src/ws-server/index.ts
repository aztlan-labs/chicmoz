import { ChicmozL2Block } from "@chicmoz-pkg/types";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "../logger.js";
import { PORT } from "../environment.js";

let wss: WebSocketServer;

export const sendBlockToClients = (block: ChicmozL2Block) => {
  if (!wss) throw new Error("WebSocket server is not initialized");
  const clientStatuses: {
    sent: number;
    failed: number;
  } = {
    sent: 0,
    failed: 0,
  };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(block));
        clientStatuses.sent++;
      } catch (e) {
        logger.warn(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Encountered error while sending block: ${e}, continuing...`
        );
        clientStatuses.failed++;
      }
    } else {
      logger.warn(
        `Client is not open, skipping... (readyState: ${client.readyState})`
      );
      clientStatuses.failed++;
    }
  });
  const totalClients = wss.clients.size;
  logger.info(
    `📡 Sent block ${block.header.globalVariables.blockNumber} to ${clientStatuses.sent} clients (failed: ${clientStatuses.failed}, total: ${totalClients})`
  );
};

export const init = async () => {
  let resolveInit: () => void;
  const initPromise = new Promise<void>((resolve) => {
    resolveInit = resolve;
  });
  wss = new WebSocketServer({ port: PORT });

  wss.on("listening", () => {
    logger.info(`WS: started! (port ${PORT})`);
    resolveInit();
  });

  wss.on("connection", (connectedWs) => {
    logger.info(`🧍 WS: client connected    (total: ${wss.clients.size})`);
    connectedWs.on("close", function close() {
      logger.info(`🚪 WS: client disconnected (total: ${wss.clients.size})`);
    });
  });

  await initPromise;

  return {
    id: "WS",
    shutdownCb: async () => {
      let resolveShutdown: () => void;
      const shutdownPromise = new Promise<void>((resolve) => {
        resolveShutdown = resolve;
      });
      logger.info(`Shutting down WebSocket server...`);
      wss.close(() => {
        logger.info(`WebSocket server closed`);
        resolveShutdown();
      });
      await shutdownPromise;
    },
  };
};
