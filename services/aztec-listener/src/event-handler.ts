import { L2Block } from "@aztec/aztec.js";
import { Logger } from "@chicmoz-pkg/logger-server";
import { MessageBus } from "@chicmoz-pkg/message-bus";
import { AZTEC_MESSAGES, generateAztecTopicName } from "@chicmoz-pkg/message-registry";
import autoBind from "auto-bind";

export class EventHandler {
  logger: Logger;
  mb: MessageBus;
  networkId: string;

  constructor(deps: { mb: MessageBus; logger: Logger; networkId: string }) {
    this.logger = deps.logger;
    this.mb = deps.mb;
    this.networkId = deps.networkId;
    autoBind(this);
  }

  onBlock = async (block: L2Block) => {
    const height = Number(block.header.globalVariables.blockNumber);
    const topic = generateAztecTopicName(this.networkId, "NEW_BLOCK_EVENT");
    this.logger.info(`Publishing block ${height} to topic ${topic}`);

    await this.mb.publish<AZTEC_MESSAGES["NEW_BLOCK_EVENT"]>(topic, {
      block,
    });
  };
}
