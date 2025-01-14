import { L2Block } from "@aztec/aztec.js";
import {
  BLOCK_POLL_INTERVAL_MS,
  IGNORE_PROCESSED_HEIGHT,
  MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS,
} from "../../constants.js";
import { onBlock } from "../../events/emitted/index.js";
import { logger } from "../../logger.js";
import { storeHeight } from "../database/latestProcessedHeight.controller.js";
import { getBlock, getBlocks, getLatestHeight } from "./network-client.js";

let pollInterval: NodeJS.Timeout;
let latestProcessedHeight = -1;

export const getLatestProcessedHeight = () => latestProcessedHeight;

export const startPolling = ({ fromHeight }: { fromHeight: number }) => {
  latestProcessedHeight = fromHeight - 1;
  pollInterval = setInterval(() => {
    void fetchAndPublishLatestBlockReoccurring();
  }, BLOCK_POLL_INTERVAL_MS);
};

export const stopPolling = () => {
  if (pollInterval) clearInterval(pollInterval);
};

const storeLatestProcessedHeight = async (height: number) => {
  const isLater = height > latestProcessedHeight;
  if (isLater) {
    latestProcessedHeight = height;
    await storeHeight(height);
  }
  return isLater;
};

const internalOnBlock = async (blockRes: L2Block | undefined) => {
  if (!blockRes) throw new Error("FATAL: Poller received no block.");
  await onBlock(blockRes);
  await storeLatestProcessedHeight(
    Number(blockRes.header.globalVariables.blockNumber)
  );
};

const fetchAndPublishLatestBlockReoccurring = async () => {
  const networkLatestHeight = await getLatestHeight();
  if (networkLatestHeight === 0)
    throw new Error("FATAL: network returned height 0");

  const alreadyProcessed = networkLatestHeight <= latestProcessedHeight;
  if (alreadyProcessed && !IGNORE_PROCESSED_HEIGHT) {
    logger.info(
      `🐻 block ${networkLatestHeight} has already been processed, skipping...`
    );
    return;
  }

  const missedBlocks = networkLatestHeight - latestProcessedHeight > 1;
  if (missedBlocks)
    await catchUpOnMissedBlocks(latestProcessedHeight + 1, networkLatestHeight);

  const blockRes = await getBlock(networkLatestHeight);
  await internalOnBlock(blockRes);
};

const catchUpOnMissedBlocks = async (from: number, to: number) => {
  if (to - from > MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS) {
    logger.error(
      `[fetchAndPublishLatestBlockReoccurring]: more than ${MAX_BATCH_SIZE_FETCH_MISSED_BLOCKS} blocks missed from ${from} to ${to}, skipping catchup...`
    );
  } else {
    logger.info(
      `🐯 it seems we missed blocks: ${from}-${to - 1}, catching up...`
    );
    const missedBlocks = await getBlocks(from, to);
    const processBlocks = missedBlocks.map((block) => {
      if (block) return internalOnBlock(block);
    });
    await Promise.allSettled(processBlocks);
    logger.info(`🐯 missed blocks ${from}-${to} done`);
  }
};
