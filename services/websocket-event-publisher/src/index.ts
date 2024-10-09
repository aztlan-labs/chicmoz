import { WebSocketServer } from "ws";
import { logger } from "./logger.js";

const port = Number(process.env.PORT) || 3000;
const wss = new WebSocketServer({ port });

logger.info(`WebSocket server started on port ${port}`);

wss.on("connection", function connection(ws) {
  logger.info("New client connected");

  ws.on("message", function incoming(message) {
    logger.info(`Received message: ${JSON.stringify(message)}`);
    ws.send(`Server received: ${JSON.stringify(message)}`);
  });

  ws.on("close", function close() {
    logger.info("Client disconnected");
  });

  ws.send("Welcome to the WebSocket server!");
});
