/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { IBackOffOptions, backOff } from "exponential-backoff";
import {
  BLOCK_INTERVAL_MS,
  IGNORE_PROCESSED_HEIGHT,
  MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS,
} from "../constants.js";
import { logger } from "../logger.js";
import { storeHeight } from "../database/latestProcessedHeight.controller.js";
import { getBlock, getBlocks, getLatestHeight } from "./network-client.js";
import { onBlock } from "../event-handler/index.js";

const backOffOptions: Partial<IBackOffOptions> = {
  numOfAttempts: 3,
  maxDelay: 5000,
  retry: (e, attemptNumber: number) => {
    logger.warn(e);
    logger.info(
      `We'll allow some API-errors, retrying attempt ${attemptNumber}...`
    );
    return true;
  },
};
let pollInterval: NodeJS.Timeout;
let latestProcessedHeight = -1;

export const startPolling = async ({ fromHeight }: { fromHeight: number }) => {
  await setLatestProcessedHeight(fromHeight - 1);
  pollInterval = setInterval(() => {
    void fetchAndPublishLatestBlockReoccurring();
  }, BLOCK_INTERVAL_MS);
};

export const stopPolling = () => {
  if (pollInterval) clearInterval(pollInterval);
};

const setLatestProcessedHeight = async (height: number) => {
  const isLater = height > latestProcessedHeight;
  if (isLater) {
    latestProcessedHeight = height;
    await storeHeight(height);
  }
  return isLater;
};

const fetchAndPublishLatestBlockReoccurring = async () => {
  const networkLatestHeight = await getLatestHeight();
  const alreadyProcessed = networkLatestHeight <= latestProcessedHeight;
  const missedBlocks = networkLatestHeight - latestProcessedHeight > 1;

  if (alreadyProcessed && !IGNORE_PROCESSED_HEIGHT) {
    logger.info(
      `🐻 block ${networkLatestHeight} has already been processed, skipping...`
    );
    return;
  }

  const blockRes = await backOff(async () => {
    return await getBlock(networkLatestHeight);
  }, backOffOptions);

  if (!blockRes) {
    throw new Error(
      "FATAL: Poller received no block, eventhough receiveing height from network."
    );
  }
  await onBlock(blockRes);

  if (missedBlocks)
    await catchUpOnMissedBlocks(latestProcessedHeight + 1, networkLatestHeight);

  await setLatestProcessedHeight(
    Number(blockRes.header.globalVariables.blockNumber)
  );
};

const catchUpOnMissedBlocks = async (start: number, end: number) => {
  if (end - start > MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS) {
    logger.error(
      `[fetchAndPublishLatestBlockReoccurring]: more than ${MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS} blocks missed, skipping catchup...`
    );
  } else {
    const startTimeMs = new Date().getTime();
    logger.info(
      `🐯 it seems we missed blocks: ${start}-${end - 1}, catching up...`
    );
    const missedBlocks = await getBlocks(start, end);

    const processBlocks = missedBlocks.map((block) => {
      if (block) return onBlock(block);
    });
    await Promise.allSettled(processBlocks);

    const durationMs = new Date().getTime() - startTimeMs;
    logger.info(`🐯 missed blocks ${start}-${end} published (${durationMs}ms)`);
  }
};
