import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { BODY_LIMIT, NODE_ENV, PARAMETER_LIMIT } from "../../environment.js";
import { setup } from "../express-config.js";

let app: express.Express;

jest.mock("../../logger.js", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

beforeAll(() => {
  app = express();
  setup(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });
});

test("/health", async () => {
  const ROUTE = "/health";
  const response = await request(app).get(ROUTE).send();
  expect(response.status).toBe(200);
});
