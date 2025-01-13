/* eslint-disable no-console */
import { Logger } from "@chicmoz-pkg/logger-server";

let l: Logger;

export const initLogger = (serviceName: string) => {
  l = new Logger(serviceName);
};

export const logger = {
  debug: (...data: unknown[]) => (l ? l.debug(data) : console.log(data)),
  info: (...data: unknown[]) => (l ? l.info(data) : console.log(data)),
  error: (...data: unknown[]) => (l ? l.error(data) : console.error(data)),
  warn: (...data: unknown[]) => (l ? l.warn(data) : console.warn(data)),
};
