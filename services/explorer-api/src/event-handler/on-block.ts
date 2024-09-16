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
  await storeBlock(b);
  await storeContracts(b);
};

const storeBlock = async (b: L2Block) => {
  let parsedBlock: ChicmozL2Block;
  try {
    logger.info(`👓 Parsing block ${b.number}`);
    parsedBlock = chicmozL2BlockSchema.parse({
      hash: b.hash().toString(),
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

//    block 214 contractInstances [
//      ContractInstanceDeployedEvent {
//        address: AztecAddress<0x1e03a77b21dddbe1f3f4d96a43ef03de51b9ee797eea1fc8c5a82abb10a396ad>,
//        version: 1,
//        salt: Fr<0x2190706dc5976f5697ab65f125aee63ef6393e8a45a1e6f93bc775870bc1402a>,
//        contractClassId: Fr<0x103bfee81ad018bc58f15008d9cc7f1fb552099e5a1c7ae9fbcde0a56c0def1d>,
//        initializationHash: Fr<0x140b491a94ac6c8ea07d11e5850e6850f965f612d2b9e665f323128acc7d531a>,
//        publicKeysHash: Fr<0x0000000000000000000000000000000000000000000000000000000000000000>,
//        deployer: AztecAddress<0x1ec689d351ad07597014ed33ce941cf752c78c7270cab23bcd050a8b06c060ba>
//      }
//    ] contractClasses [
//      ContractClassRegisteredEvent {
//        contractClassId: Fr<0x103bfee81ad018bc58f15008d9cc7f1fb552099e5a1c7ae9fbcde0a56c0def1d>,
//        version: 1,
//        artifactHash: Fr<0x1517f66a10bbef5b7c17852b3accd1272b844e97ff7fcfed3e226e1f46c925ad>,
//        privateFunctionsRoot: Fr<0x221318c79f077bb86be40a80d20cc24b011dd8565edd54225c860dbc68a9a0c5>,
//        packedPublicBytecode: <Buffer 00 00 00 03 1f 69 33 c3 00 00 01 c0 1f 8b 08 00 00 00 00 00 02 ff 65 52 c1 6e 14 31 0c 7d 89 33 8e e3 99 e1 5c 69 11 37 84 b4 d0 ee 65 46 20 38 d2 22 ... 6005 more bytes>
//      }
//    ]

const storeContracts = async (b: L2Block) => {
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
    //await controllers.l2ContractInstance.store(parsedContractInstances);
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
    //await controllers.l2ContractClass.store(parsedContractClasses);
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to store contractClasses: ${(e as Error)?.stack ?? e}`
    );
  }

};
