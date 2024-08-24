import { Logger } from "@chicmoz-pkg/logger-server";
import autoBind from "auto-bind";

export class EventHandler {
  logger: Logger;

  constructor(deps: { logger: Logger }) {
    this.logger = deps.logger;
    autoBind(this);
  }

  onBlock() {
    this.logger.info("New block event received");
    return;
  }
}
