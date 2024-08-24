import { Logger } from "@chicmoz-pkg/logger-server";
import { MessageBus } from "@chicmoz-pkg/message-bus";
import autoBind from "auto-bind";
import { AztecEvents } from "./aztec-events.js";
import { AztecNetworkClient } from "./aztec-network-client.js";
import { BLOCK_INTERVAL_MS, CATCHUP_ENABLED, CATCHUP_END, CATCHUP_START, LISTEN_FOR_BLOCKS } from "./constants.js";
import { DB } from "./db.js";
import { EventHandler } from "./event-handler.js";

export class Core {
  aztecEvents: AztecEvents;
  eventHandler: EventHandler;
  logger: Logger;

  constructor(deps: { mb: MessageBus; networkClient: AztecNetworkClient; logger: Logger; db: DB; networkId: string }) {
    this.logger = deps.logger;
    this.aztecEvents = new AztecEvents({ networkClient: deps.networkClient, logger: deps.logger, db: deps.db });
    this.eventHandler = new EventHandler({ mb: deps.mb, logger: deps.logger, networkId: deps.networkId });
    autoBind(this);
  }

  async start(latestProcessedHeight = -1) {
    const latestHeight = await this.aztecEvents.getLatestHeight();

    if (CATCHUP_ENABLED && latestHeight - latestProcessedHeight >= 1) {
      // NOTE: the first catchup is done before starting to listen for new blocks
      let startFrom = latestProcessedHeight + 1;
      if (CATCHUP_START !== undefined) {
        if (CATCHUP_START < 0) {
          throw new Error("CATCHUP_START is negative, this is not allowed");
        } else if (CATCHUP_START > latestHeight) {
          throw new Error("CATCHUP_START is larger than latestHeight, this is not allowed");
        } else {
          this.logger.info("Using CATCHUP_START");
          startFrom = CATCHUP_START;
        }
      }

      let endAt = latestHeight + 1;
      if (CATCHUP_END !== undefined) {
        if (CATCHUP_END < 0) {
          throw new Error("CATCHUP_END is negative, this is not allowed");
        } else if (CATCHUP_END > latestHeight) {
          throw new Error("CATCHUP_END is larger than latestHeight, this is not allowed");
        } else {
          this.logger.info("Using CATCHUP_END");
          endAt = CATCHUP_END;
        }
      }

      this.logger.info(`Starting catchup from height: ${startFrom} to ${endAt}`);
      await this.aztecEvents.catchUpOnBlocks(this.eventHandler.onBlock, startFrom, endAt);
    }
    if (LISTEN_FOR_BLOCKS) {
      this.logger.info("Listening for new blocks...");
      this.aztecEvents.listenForNewBlocks(BLOCK_INTERVAL_MS, this.eventHandler.onBlock);
    }
    if (CATCHUP_ENABLED && CATCHUP_END === undefined) {
      // NOTE: the second catchup is done after starting to listen for new blocks (in case new blocks were produced while the first catchup was running)
      const newLatestHeight = await this.aztecEvents.getLatestHeight();
      if (Math.abs(newLatestHeight - latestHeight) >= 1) {
        this.logger.info("Starting (mini) catchup from height: ", latestHeight + 1);
        await this.aztecEvents.catchUpOnBlocks(this.eventHandler.onBlock, latestHeight + 1, newLatestHeight + 1);
      }
    }
  }

  stop() {
    this.aztecEvents.stopListeningForNewBlocks();
  }
}
