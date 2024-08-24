import autoBind from "auto-bind";
import winston from "winston";

export class Logger {
  #logger: winston.Logger;

  constructor(name: string) {
    autoBind(this);
    this.#logger = winston.createLogger({
      format: winston.format.cli(),
      transports: [new winston.transports.Console()],
      defaultMeta: { name },
    });
  }

  info(...data: unknown[]) {
    this.#logger.info(data);
  }

  error(...data: unknown[]) {
    this.#logger.error(data);
  }

  warn(...data: unknown[]) {
    this.#logger.warn(data);
  }
}
