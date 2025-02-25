import { logger } from "../../logger.js";
import {
  getFinalizedHeight,
  setFinalizedHeight,
} from "../../svcs/database/controllers.js";
import { getPublicClient } from "../client.js";
import { AztecContracts } from "./utils.js";

export const getAllContractsEvents = async ({
  contracts,
  toBlock,
}: {
  contracts: AztecContracts;
  toBlock: "finalized";
}) => {
  const fromBlock = await getFinalizedHeight();
  logger.info(`🐻 Getting finalized events from block ${fromBlock}`);
  let heighestBlockNumber = fromBlock;
  for (const contract of Object.values(contracts)) {
    const client = getPublicClient();
    const events = await client.getContractEvents({
      fromBlock,
      toBlock,
      address: contract.address,
      abi: contract.abi,
    });
    // TODO: Call onLogs for each event
    for (const event of events) {
      heighestBlockNumber =
        event.blockNumber && event.blockNumber > heighestBlockNumber
          ? event.blockNumber
          : heighestBlockNumber;
    }
  }
  await setFinalizedHeight(heighestBlockNumber);
};
