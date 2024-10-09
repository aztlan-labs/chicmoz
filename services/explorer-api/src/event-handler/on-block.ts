import { L2Block } from "@aztec/aztec.js";
import {
  ContractClassRegisteredEvent,
  ContractInstanceDeployedEvent,
} from "@aztec/circuits.js";
import { ClassRegistererAddress } from "@aztec/protocol-contracts/class-registerer";
import { NewBlockEvent } from "@chicmoz-pkg/message-registry";
import { parseBlock, blockFromString } from "@chicmoz-pkg/backend-utils";
import {
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
  type ChicmozL2Block,
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
      `Failed to parse block ${blockNumber}: ${e}`
    );
    return;
  }
  await storeBlock(parsedBlock);
  await storeContracts(b, parsedBlock.hash);
};

const storeBlock = async (parsedBlock: ChicmozL2Block) => {
  try {
    logger.info(`🧢 Storing block ${parsedBlock.height} (hash: ${parsedBlock.hash})`);
    // logger.info(JSON.stringify(parsedBlock));
    await controllers.l2Block.store(parsedBlock);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store block ${parsedBlock.height}: ${(e as Error)?.stack ?? e}`
    );
  }
};

const storeContracts = async (b: L2Block, blockHash: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const blockLogs = b.body.txEffects
    .flatMap((txEffect) => (txEffect ? [txEffect.unencryptedLogs] : []))
    .flatMap((txLog) => txLog.unrollLogs());
  const contractClasses = ContractClassRegisteredEvent.fromLogs(
    blockLogs,
    ClassRegistererAddress
  );
  const contractInstances = ContractInstanceDeployedEvent.fromLogs(blockLogs);

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
    try {
      await controllers.l2Contract.storeContractClass(contractClass);
    } catch (e) {
      logger.error(
        `Failed to store contractClass (${
          contractClass.contractClassId
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        }) in block ${blockHash}): ${(e as Error)?.stack ?? e}`
      );
    }
  }
  for (const contractInstance of parsedContractInstances) {
    try {
      await controllers.l2Contract.storeContractInstance(contractInstance);
    } catch (e) {
      logger.error(
        `Failed to store contractInstance (${
          contractInstance.address
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        }) in block ${blockHash}): ${(e as Error)?.stack ?? e}`
      );
    }
  }
};
