import { L2Block } from "@aztec/aztec.js";
import { Logger } from "@chicmoz-pkg/logger-server";
import autoBind from "auto-bind";
import { IBackOffOptions, backOff } from "exponential-backoff";
import { AztecNetworkClient } from "./aztec-network-client.js";
import { IGNORE_PROCESSED_HEIGHT, MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS } from "./constants.js";
import { DB } from "./db.js";

export class AztecEvents {
  networkClient: AztecNetworkClient;
  logger: Logger;
  db: DB;
  newBlockInterval: NodeJS.Timeout | null = null;
  latestHeightPublished = -1;
  backOffOptions: Partial<IBackOffOptions>;

  constructor(deps: { networkClient: AztecNetworkClient; logger: Logger; db: DB }) {
    this.logger = deps.logger;
    this.networkClient = deps.networkClient;
    this.db = deps.db;
    (this.backOffOptions = {
      numOfAttempts: 3,
      maxDelay: 5000,
      retry: (e, attemptNumber: number) => {
        deps.logger.warn(e);
        deps.logger.info(`We'll allow some API-errors, retrying attempt ${attemptNumber}...`);
        return true;
      },
    }),
      autoBind(this);
  }

  /** Fetch blocks at given height range, passing each one to the onBlock callback */
  async catchUpOnBlocks(onBlockCB: (block: L2Block) => Promise<void>, startingHeight: number, endingHeight: number) {
    try {
      for (let i = startingHeight; i <= endingHeight; i += 1) {
        const blockRes = await this.networkClient.getBlock(i);
        if (blockRes instanceof Error) throw new Error(`🦆 error fetching block ${i}`);
        if (!blockRes)
          throw new Error("🐯 We didn't receive any block. - Is the node running?");
        this.logger.info(`🦆 found 1 old block: ${i}`);
        await onBlockCB(blockRes);
        const height = Number(blockRes.header.globalVariables.blockNumber);
        await this.setlatestHeightPublished(height);
      }
      this.logger.info("🦆 all blocks processed, completing...");
    } catch (err) {
      this.logger.error(`🦆 error catching up blocks: ${(err as Error).stack}`);
      throw err;
    }
  }

  async getLatestHeight(): Promise<number> {
    let height;
    try {
      height = await this.networkClient.getLatestHeight();
    } catch (error) {
      this.logger.error(`Error fetching latest height`, error);
      return -1;
    }
    return height;
  }

  async fetchBlockRange(start: number, end: number) {
    const blocks = [];
    for (let i = start; i <= end; i++) {
      try {
        const blockRes = await backOff(async () => {
          return await this.networkClient.getBlock(i);
        }, this.backOffOptions);
        if (blockRes instanceof Error) throw blockRes;
        blocks.push(blockRes);
      } catch (e) {
        this.logger.error(`[fetchBlockRange(${start},${end})] Error fetching block range:`, e);
      }
    }

    return blocks;
  }

  async setlatestHeightPublished(height: number) {
    if (height > this.latestHeightPublished) {
      this.latestHeightPublished = height;

      this.logger.info(`Storing latest height processed with height: ${this.latestHeightPublished}...`);
      await this.db.storeHeight(this.latestHeightPublished);
    }
  }

  stopListeningForNewBlocks() {
    if (this.newBlockInterval) clearInterval(this.newBlockInterval);
  }

  private async fetchAndPublishLatestBlockReoccurring(onBlockCB: (block: L2Block) => Promise<void>) {
    // Fetch latest height
    const latestHeight = await this.getLatestHeight();
    const alreadyProcessed = latestHeight === this.latestHeightPublished;
    const missedBlocks = latestHeight - this.latestHeightPublished > 1;

    // Skip processed blocks
    if (alreadyProcessed && !IGNORE_PROCESSED_HEIGHT) {
      this.logger.info(`🐯 block ${latestHeight} has already been processed, skipping...`);
      return;
    }

    // Fetch latests block
    const blockRes = await backOff(async () => {
      return this.networkClient.getBlock(latestHeight);
    }, this.backOffOptions);
    if (blockRes instanceof Error) throw blockRes;
    if (!blockRes)
      throw new Error("🐯 We didn't receive any block from the backoff function. This should never happen and is really fishy");
    this.logger.info(`🐯 latest block received! height: ${blockRes.header.globalVariables.blockNumber}`);

    // Process latest block
    await onBlockCB(blockRes);

    // Check for missing blocks since last published
    if (missedBlocks) {
      const start = this.latestHeightPublished + 1;
      const end = latestHeight;

      // This mechanism is design to fetch between 1 and 50 missed blocks, anything more should be skipped
      if (end - start > MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS) {
        this.logger.error(
          `[fetchAndPublishLatestBlockReoccurring]: more than ${MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS} blocks missed, skipping fetch`,
        );
      } else {
        const startTimeMs = new Date().getTime();
        this.logger.info(`🐯 it seems we missed blocks: ${start}-${end - 1}, catching up...`);
        const fetchedBlocks = await this.fetchBlockRange(this.latestHeightPublished, latestHeight);

        // Process missing blocks
        const processBlocks = fetchedBlocks.map((block) => {
          if (block) return onBlockCB(block);
        });
        await Promise.allSettled(processBlocks);

        const durationMs = new Date().getTime() - startTimeMs;
        this.logger.info(`🐯 blocks ${start}-${end} published (${durationMs}ms)`);
      }
    }

    // FIXME: update height once aztec types are present
    await this.setlatestHeightPublished(Number(blockRes.header.globalVariables.blockNumber));
  }

  listenForNewBlocks(intervalMs: number, onBlockCB: (block: L2Block) => Promise<void>) {
    this.newBlockInterval = setInterval(() => {
      void this.fetchAndPublishLatestBlockReoccurring(onBlockCB);
    }, intervalMs);
  }
}
