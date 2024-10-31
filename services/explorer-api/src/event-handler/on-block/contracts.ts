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
  chicmozL2UnconstrainedFunctionBroadcastedEventSchema,
  type ChicmozL2ContractClassRegisteredEvent,
  type ChicmozL2ContractInstanceDeployedEvent,
  type ChicmozL2PrivateFunctionBroadcastedEvent,
  type ChicmozL2UnconstrainedFunctionBroadcastedEvent,
} from "@chicmoz-pkg/types";
import { controllers } from "../../database/index.js";
import { logger } from "../../logger.js";
import { handleDuplicateError } from "./utils.js";

const parseObjs = <T>(
  blockHash: string,
  objs: (ContractClassRegisteredEvent | ContractInstanceDeployedEvent | PrivateFunctionBroadcastedEvent | UnconstrainedFunctionBroadcastedEvent)[],
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

  const privateFnEvents = PrivateFunctionBroadcastedEvent.fromLogs(
    blockLogs,
    ProtocolContractAddress.ContractClassRegisterer
  );

  const unconstrainedFnEvents = UnconstrainedFunctionBroadcastedEvent.fromLogs(
    blockLogs,
    ProtocolContractAddress.ContractClassRegisterer
  );

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const parsedUnconstrainedFnEvents: ChicmozL2UnconstrainedFunctionBroadcastedEvent[] =
    parseObjs(blockHash, unconstrainedFnEvents, (unconstrainedFnEvent) =>
      chicmozL2UnconstrainedFunctionBroadcastedEventSchema.parse(unconstrainedFnEvent)
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
