import { Logger } from "@chicmoz-pkg/logger-server";
import bodyParser from "body-parser";
import express from "express";

const SERVICE_NAME = process.env.SERVICE_NAME ?? "dummy-node";
const logger = new Logger(SERVICE_NAME);

const PORT = Number(process.env.PORT);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res) => {
  logger.info(`${req.method} ${req.url} ${JSON.stringify(req.headers)} ${JSON.stringify(req.body)}`);
  res.sendStatus(200);
});

logger.info(`Server listening on port ${PORT}`);
app.listen(PORT);
