/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { jest } from "@jest/globals";
import { createErrorMiddleware } from "@chicmoz-pkg/error-middleware";
import express from "express";
import request from "supertest";

import { BODY_LIMIT, NODE_ENV, PARAMETER_LIMIT } from "../constants";
import { expressConfig } from "../express-config";
import { newRouter } from "./route";

let app: express.Express;

jest.unstable_mockModule("@chicmoz-pkg/logger-server", () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

beforeAll(async () => {
  const { Logger } = await import("@chicmoz-pkg/logger-server");

  app = express();
  expressConfig(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });
  const logger = new Logger("test");
  app.use(newRouter({ logger }));
  const errorMiddleware = createErrorMiddleware(logger);
  app.use(errorMiddleware);
});

test("/health", async () => {
  const ROUTE = "/health";
  const response = await request(app).get(ROUTE).send();
  expect(response.status).toBe(200);
});
