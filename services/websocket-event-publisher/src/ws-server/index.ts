import { ChicmozL2Block } from "@chicmoz-pkg/types";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "../logger.js";
import { PORT } from "../environment.js";

let wss: WebSocketServer;

export const sendBlockToClients = (block: ChicmozL2Block) => {
  if (!wss) throw new Error("WebSocket server is not initialized");
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN)
      client.send(JSON.stringify(block));
    else logger.warn(`WS: client not connected!`);
  });
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
    logger.info(`🧍 WS: client connected`);
    connectedWs.on("message", (incomingMessage) => {
      // REMOVEME
      logger.info(`Received message: ${JSON.stringify(incomingMessage)}`);
      connectedWs.send(`SERVER ECHO: ${JSON.stringify(incomingMessage)}`);
    });
    connectedWs.on("close", function close() {
      logger.info(`🚪 WS: client disconnected`);
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
