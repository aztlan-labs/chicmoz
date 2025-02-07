import { getDb as db } from "@chicmoz-pkg/postgres-helper";
import { ChicmozL1GenericContractEvent } from "@chicmoz-pkg/types";
import { l1GenericContractEventTable } from "../../../schema/l1/generic-contract-event.js";

export const store = async (contractEvent: ChicmozL1GenericContractEvent) => {
  return await db().insert(l1GenericContractEventTable).values({
    // TODO: txHash: contractEvent.txHash,
    l1BlockHash: contractEvent.l1BlockHash,
    l1BlockNumber: contractEvent.l1BlockNumber,
    l1BlockTimestamp: contractEvent.l1BlockTimestamp,
    l1ContractAddress: contractEvent.l1ContractAddress,
    eventName: contractEvent.eventName,
    eventArgs: contractEvent.eventArgs,
  });
};
