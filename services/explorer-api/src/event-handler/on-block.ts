import { L2Block } from "@aztec/aztec.js";
import {
  ContractClassRegisteredEvent,
  ContractInstanceDeployedEvent,
} from "@aztec/circuits.js";
import { ClassRegistererAddress } from "@aztec/protocol-contracts/class-registerer";
import { blockFromString, parseBlock } from "@chicmoz-pkg/backend-utils";
import { NewBlockEvent } from "@chicmoz-pkg/message-registry";
import {
  ChicmozL2Block,
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
} from "@chicmoz-pkg/types";
import { controllers } from "../database/index.js";
import { logger } from "../logger.js";

export const onBlock = async ({ block, blockNumber }: NewBlockEvent) => {
  // TODO: start storing NODE_INFO connected to the block
  if (!block) {
    logger.error("🚫 Block is empty");
    return;
  }
  logger.info(`👓 Parsing block ${blockNumber}`);
  const b = blockFromString(block);
  let parsedBlock;
  try {
    parsedBlock = parseBlock(b);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to parse block ${blockNumber}: ${(e as Error)?.stack ?? e}`
    );
    return;
  }
  await storeBlock(parsedBlock);
  await storeContracts(b, parsedBlock.hash);
};

type PartialDbError = {
  code: string;
};

const handleDuplicateError = (
  e: Error | PartialDbError,
  additionalInfo: string
) => {
  if ((e as PartialDbError).code === "23505") {
    logger.warn(`DB Duplicate: ${additionalInfo}`);
    return;
  }
  if ((e as Error).stack) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store ${additionalInfo}: ${(e as Error)?.stack}`
    );
    return;
  }
  logger.warn(JSON.stringify(e));
  logger.error(new Error(`Failed to store ${additionalInfo}`).stack);
};

const storeBlock = async (parsedBlock: ChicmozL2Block) => {
  logger.info(
    `🧢 Storing block ${parsedBlock.height} (hash: ${parsedBlock.hash})`
  );
  await controllers.l2Block.store(parsedBlock).catch((e) => {
    handleDuplicateError(e as Error, `block ${parsedBlock.height}`);
  });
};

const storeContracts = async (b: L2Block, blockHash: string) => {
  const blockLogs = b.body.txEffects
    .flatMap((txEffect) => (txEffect ? [txEffect.unencryptedLogs] : []))
    .flatMap((txLog) => txLog.unrollLogs());
  const contractClasses = ContractClassRegisteredEvent.fromLogs(
    blockLogs,
    ClassRegistererAddress
  );
  const contractInstances = ContractInstanceDeployedEvent.fromLogs(blockLogs);
  logger.info(
    `Parsing and storing ${contractClasses.length} contract classes and ${contractInstances.length} contract instances`
  );

  const parsedContractClasses: ChicmozL2ContractClassRegisteredEvent[] = [];
  const parsedContractInstances: ChicmozL2ContractInstanceDeployedEvent[] = [];
  for (const contractClass of contractClasses) {
    try {
      const parsed = chicmozL2ContractClassRegisteredEventSchema.parse(
        JSON.parse(
          JSON.stringify({
            blockHash,
            ...contractClass,
          })
        )
      );
      parsedContractClasses.push(parsed);
    } catch (e) {
      logger.error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Failed to parse contractClass ${contractClass.contractClassId}: ${e}`
      );
    }
  }
  for (const contractInstance of contractInstances) {
    try {
      const parsed: ChicmozL2ContractInstanceDeployedEvent =
        chicmozL2ContractInstanceDeployedEventSchema.parse(
          JSON.parse(
            JSON.stringify({
              blockHash,
              ...contractInstance,
            })
          )
        );
      parsedContractInstances.push(parsed);
    } catch (e) {
      logger.error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Failed to parse contractInstance ${contractInstance.address}: ${e}`
      );
    }
  }

  for (const contractClass of parsedContractClasses) {
    await controllers.l2Contract
      .storeContractClass(contractClass)
      .catch((e) => {
        handleDuplicateError(
          e as Error,
          `contractClass ${contractClass.contractClassId}`
        );
      });
  }
  for (const contractInstance of parsedContractInstances) {
    await controllers.l2Contract
      .storeContractInstance(contractInstance)
      .catch((e) => {
        handleDuplicateError(
          e as Error,
          `contractInstance ${contractInstance.address}`
        );
      });
  }
};
