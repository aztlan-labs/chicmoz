import { Logger } from "@chicmoz-pkg/logger-server";
import { MessageBus } from "@chicmoz-pkg/message-bus";
import { AZTEC_MESSAGES, generateAztecTopicName } from "@chicmoz-pkg/message-registry";
import autoBind from "auto-bind";
import { backOff } from "exponential-backoff";
import { SERVICE_NAME } from "./constants.js";
import { EventHandler } from "./event-handler.js";

export class Core {
  eventHandler: EventHandler;
  mb: MessageBus;
  logger: Logger;
  networkId: string;
  // dbValidation: DbValidation;
  lastBlockHeightValidated: number;

  constructor(deps: { logger: Logger; mb: MessageBus; networkId: string; eventHandler: EventHandler }) {
    this.logger = deps.logger;
    this.mb = deps.mb;
    this.eventHandler = deps.eventHandler;
    this.networkId = deps.networkId;
    this.lastBlockHeightValidated = 0;
    autoBind(this);
  }

  onBlockEvent = (blockEvent: AZTEC_MESSAGES["NEW_BLOCK_EVENT"]) => {
    this.logger.info(JSON.stringify(blockEvent));
    return;
  };

  private startSubscribe = async () => {
    await this.mb.subscribe<AZTEC_MESSAGES["NEW_BLOCK_EVENT"]>(
      SERVICE_NAME,
      generateAztecTopicName(this.networkId, "NEW_BLOCK_EVENT"),
      this.onBlockEvent,
    );
    await this.mb.runConsumer(SERVICE_NAME);
  };

  async start() {
    await backOff(this.startSubscribe, {
      maxDelay: 10000,
      retry: (e, attemptNumber: number) => {
        this.logger.warn(e);
        this.logger.info(`Retrying attempt ${attemptNumber}...`);
        return true;
      },
    });
  }
}
