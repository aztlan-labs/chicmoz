import { L2Block } from "@aztec/aztec.js";
import {
  ContractClassRegisteredEvent,
  ContractInstanceDeployedEvent,
} from "@aztec/circuits.js";
import { ClassRegistererAddress } from "@aztec/protocol-contracts/class-registerer";
import { NewBlockEvent } from "@chicmoz-pkg/message-registry";
import {
  chicmozL2BlockSchema,
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
  type ChicmozL2Block,
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
} from "@chicmoz-pkg/types";
import { controllers } from "../database/index.js";
import { logger } from "../logger.js";

export const onBlock = async ({ block }: NewBlockEvent) => {
  // TODO: start storing NODE_INFO connected to the block
  if (!block) {
    logger.error("🚫 Block is empty");
    return;
  }
  const b = L2Block.fromString(block);
  const hash = b.hash().toString();
  await storeBlock(b, hash);
  await storeContracts(b, hash);
};

const storeBlock = async (b: L2Block, hash: string) => {
  let parsedBlock: ChicmozL2Block;
  try {
    logger.info(`👓 Parsing block ${b.number}`);
    parsedBlock = chicmozL2BlockSchema.parse({
      hash,
      ...JSON.parse(JSON.stringify(b)),
    });
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to parse block ${b.number}: ${e}`
    );
    return;
  }
  try {
    logger.info(`🧢 Storing block ${b.number} (hash: ${parsedBlock.hash})`);
    // logger.info(JSON.stringify(parsedBlock));
    await controllers.l2Block.store(parsedBlock);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store block ${b.number}: ${(e as Error)?.stack ?? e}`
    );
  }
};

const storeContracts = async (b: L2Block, blockHash: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const blockLogs = b.body.txEffects
    .flatMap((txEffect) => (txEffect ? [txEffect.unencryptedLogs] : []))
    .flatMap((txLog) => txLog.unrollLogs());
  const contractInstances = ContractInstanceDeployedEvent.fromLogs(blockLogs);
  const contractClasses = ContractClassRegisteredEvent.fromLogs(
    blockLogs,
    ClassRegistererAddress
  );
  logger.info(
    `block ${b.number} contractInstances ${JSON.stringify(
      contractInstances
    )} contractClasses ${JSON.stringify(contractClasses)}`
  );

  const parsedContractInstances: ChicmozL2ContractInstanceDeployedEvent[] = [];
  const parsedContractClasses: ChicmozL2ContractClassRegisteredEvent[] = [];
  for (const contractInstance of contractInstances) {
    try {
      const parsed: ChicmozL2ContractInstanceDeployedEvent =
        chicmozL2ContractInstanceDeployedEventSchema.parse(
          JSON.parse(JSON.stringify(contractInstance))
        );
      parsedContractInstances.push(parsed);
    } catch (e) {
      logger.error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Failed to parse contractInstance ${contractInstance.address}: ${e}`
      );
    }
  }
  for (const contractClass of contractClasses) {
    try {
      const parsed = chicmozL2ContractClassRegisteredEventSchema.parse(
        JSON.parse(JSON.stringify(contractClass))
      );
      parsedContractClasses.push(parsed);
    } catch (e) {
      logger.error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Failed to parse contractClass ${contractClass.contractClassId}: ${e}`
      );
    }
  }

  try {
    logger.info(
      `Storing contractInstances ${JSON.stringify(parsedContractInstances)}`
    );
    for (const contractInstance of parsedContractInstances) {
      await controllers.l2Contract.storeContractInstance(
        contractInstance,
        blockHash
      );
    }
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store contractInstances: ${(e as Error)?.stack ?? e}`
    );
  }

  try {
    logger.info(
      `Storing contractClasses ${JSON.stringify(parsedContractClasses)}`
    );
    for (const contractClass of parsedContractClasses) {
      await controllers.l2Contract.storeContractClass(
        contractClass,
        blockHash
      );
    }
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store contractClasses: ${(e as Error)?.stack ?? e}`
    );
  }

};
