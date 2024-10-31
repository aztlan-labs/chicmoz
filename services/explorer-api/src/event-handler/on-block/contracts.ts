import { L2Block } from "@aztec/aztec.js";
import {
  ContractClassRegisteredEvent,
  ContractInstanceDeployedEvent,
  PrivateFunctionBroadcastedEvent,
  UnconstrainedFunctionBroadcastedEvent,
} from "@aztec/circuits.js";
import { ProtocolContractAddress } from "@aztec/protocol-contracts";
import {
  chicmozL2ContractClassRegisteredEventSchema,
  chicmozL2ContractInstanceDeployedEventSchema,
  chicmozL2PrivateFunctionBroadcastedEventSchema,
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
  type ChicmozL2PrivateFunctionBroadcastedEvent,
} from "@chicmoz-pkg/types";
import { controllers } from "../../database/index.js";
import { logger } from "../../logger.js";
import { handleDuplicateError } from "./utils.js";

const parseObjs = <T>(
  blockHash: string,
  objs: (ContractClassRegisteredEvent | ContractInstanceDeployedEvent | PrivateFunctionBroadcastedEvent)[],
  parseFn: (obj: unknown) => T
) => {
  const parsedObjs: T[] = [];
  for (const obj of objs) {
    try {
      const parsed = parseFn(
        JSON.parse(
          JSON.stringify({
            blockHash,
            ...obj,
          })
        )
      );
      parsedObjs.push(parsed);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.error(`Failed to parse object: ${e}`);
    }
  }
  return parsedObjs;
};

const storeObj = async <T>(
  objs: T[],
  storeFn: (obj: T) => Promise<void>,
  objType: string,
  objId: keyof T
) => {
  for (const obj of objs) {
    await storeFn(obj).catch((e) => {
      const duplicateErrorId = obj[objId] as string;
      handleDuplicateError(e as Error, `${objType} ${duplicateErrorId}`);
    });
  }
};

export const storeContracts = async (b: L2Block, blockHash: string) => {
  const blockLogs = b.body.txEffects
    .flatMap((txEffect) => (txEffect ? [txEffect.unencryptedLogs] : []))
    .flatMap((txLog) => txLog.unrollLogs());
  const contractClasses = ContractClassRegisteredEvent.fromLogs(
    blockLogs,
    ProtocolContractAddress.ContractClassRegisterer
  );
  const contractInstances = ContractInstanceDeployedEvent.fromLogs(blockLogs);
  logger.info(
    `Parsing and storing ${contractClasses.length} contract classes and ${contractInstances.length} contract instances`
  );

  logger.info("======================================");

  const privateFnEvents = PrivateFunctionBroadcastedEvent.fromLogs(
    blockLogs,
    ProtocolContractAddress.ContractClassRegisterer
  );

  const unconstrainedFnEvents = UnconstrainedFunctionBroadcastedEvent.fromLogs(
    blockLogs,
    ProtocolContractAddress.ContractClassRegisterer
  );
  logger.info(JSON.stringify(unconstrainedFnEvents));
  logger.info("======================================");

  const parsedContractClasses: ChicmozL2ContractClassRegisteredEvent[] =
    parseObjs(blockHash, contractClasses, (contractClass) =>
      chicmozL2ContractClassRegisteredEventSchema.parse(contractClass)
    );
  const parsedContractInstances: ChicmozL2ContractInstanceDeployedEvent[] =
    parseObjs(blockHash, contractInstances, (contractInstance) =>
      chicmozL2ContractInstanceDeployedEventSchema.parse(contractInstance)
    );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parsedPrivateFnEvents: ChicmozL2PrivateFunctionBroadcastedEvent[] =
    parseObjs(blockHash, privateFnEvents, (privateFnEvent) =>
      chicmozL2PrivateFunctionBroadcastedEventSchema.parse(privateFnEvent)
    );

  await storeObj(
    parsedContractClasses,
    controllers.l2Contract.storeContractClass,
    "contractClass",
    "contractClassId"
  );
  await storeObj(
    parsedContractInstances,
    controllers.l2Contract.storeContractInstance,
    "contractInstance",
    "address"
  );

  // TODO: store broadcasted functions
};
//
//  /**
//   * Extracts and stores contract classes out of ContractClassRegistered events emitted by the class registerer contract.
//   * @param allLogs - All logs emitted in a bunch of blocks.
//   */
//  async #updateRegisteredContractClasses(allLogs: UnencryptedL2Log[], blockNum: number, operation: Operation) {
//    const contractClasses = ContractClassRegisteredEvent.fromLogs(
//      allLogs,
//      ProtocolContractAddress.ContractClassRegisterer,
//    ).map(e => e.toContractClassPublic());
//    if (contractClasses.length > 0) {
//      contractClasses.forEach(c => this.#log.verbose(`Registering contract class ${c.id.toString()}`));
//      if (operation == Operation.Store) {
//        return await this.store.addContractClasses(contractClasses, blockNum);
//      } else if (operation == Operation.Delete) {
//        return await this.store.deleteContractClasses(contractClasses, blockNum);
//      }
//    }
//    return true;
//  }
//
//  /**
//   * Extracts and stores contract instances out of ContractInstanceDeployed events emitted by the canonical deployer contract.
//   * @param allLogs - All logs emitted in a bunch of blocks.
//   */
//  async #updateDeployedContractInstances(allLogs: UnencryptedL2Log[], blockNum: number, operation: Operation) {
//    const contractInstances = ContractInstanceDeployedEvent.fromLogs(allLogs).map(e => e.toContractInstance());
//    if (contractInstances.length > 0) {
//      contractInstances.forEach(c =>
//        this.#log.verbose(`${Operation[operation]} contract instance at ${c.address.toString()}`),
//      );
//      if (operation == Operation.Store) {
//        return await this.store.addContractInstances(contractInstances, blockNum);
//      } else if (operation == Operation.Delete) {
//        return await this.store.deleteContractInstances(contractInstances, blockNum);
//      }
//    }
//    return true;
//  }
//
//  /**
//   * Stores the functions that was broadcasted individually
//   *
//   * @dev   Beware that there is not a delete variant of this, since they are added to contract classes
//   *        and will be deleted as part of the class if needed.
//   *
//   * @param allLogs - The logs from the block
//   * @param _blockNum - The block number
//   * @returns
//   */
//  async #storeBroadcastedIndividualFunctions(allLogs: UnencryptedL2Log[], _blockNum: number) {
//    // Filter out private and unconstrained function broadcast events
//    const privateFnEvents = PrivateFunctionBroadcastedEvent.fromLogs(
//      allLogs,
//      ProtocolContractAddress.ContractClassRegisterer,
//    );
//    const unconstrainedFnEvents = UnconstrainedFunctionBroadcastedEvent.fromLogs(
//      allLogs,
//      ProtocolContractAddress.ContractClassRegisterer,
//    );
//
//    // Group all events by contract class id
//    for (const [classIdString, classEvents] of Object.entries(
//      groupBy([...privateFnEvents, ...unconstrainedFnEvents], e => e.contractClassId.toString()),
//    )) {
//      const contractClassId = Fr.fromString(classIdString);
//      const contractClass = await this.getContractClass(contractClassId);
//      if (!contractClass) {
//        this.#log.warn(`Skipping broadcasted functions as contract class ${contractClassId.toString()} was not found`);
//        continue;
//      }
//
//      // Split private and unconstrained functions, and filter out invalid ones
//      const allFns = classEvents.map(e => e.toFunctionWithMembershipProof());
//      const privateFns = allFns.filter(
//        (fn): fn is ExecutablePrivateFunctionWithMembershipProof => 'unconstrainedFunctionsArtifactTreeRoot' in fn,
//      );
//      const unconstrainedFns = allFns.filter(
//        (fn): fn is UnconstrainedFunctionWithMembershipProof => 'privateFunctionsArtifactTreeRoot' in fn,
//      );
//      const validPrivateFns = privateFns.filter(fn => isValidPrivateFunctionMembershipProof(fn, contractClass));
//      const validUnconstrainedFns = unconstrainedFns.filter(fn =>
//        isValidUnconstrainedFunctionMembershipProof(fn, contractClass),
//      );
//      const validFnCount = validPrivateFns.length + validUnconstrainedFns.length;
//      if (validFnCount !== allFns.length) {
//        this.#log.warn(`Skipping ${allFns.length - validFnCount} invalid functions`);
//      }
//
//      // Store the functions in the contract class in a single operation
//      if (validFnCount > 0) {
//        this.#log.verbose(`Storing ${validFnCount} functions for contract class ${contractClassId.toString()}`);
//      }
//      return await this.store.addFunctions(contractClassId, validPrivateFns, validUnconstrainedFns);
//    }
//    return true;
//  }
