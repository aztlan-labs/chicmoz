import { Logger } from "@chicmoz-pkg/logger-server";
import { INSTANCE_NAME } from "./constants.js";

export const logger: Logger = new Logger(INSTANCE_NAME);
