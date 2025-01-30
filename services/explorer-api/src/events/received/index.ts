import { EventHandler } from "@chicmoz-pkg/message-bus";
import {
  generateL1TopicName,
  generateL2TopicName,
  type NewBlockEvent,
  type PendingTxsEvent,
} from "@chicmoz-pkg/message-registry";
import { getL1NetworkId } from "@chicmoz-pkg/types";
import { SERVICE_NAME } from "../../constants.js";
import { L2_NETWORK_ID } from "../../environment.js";
import { logger } from "../../logger.js";
import { startSubscribe } from "../../svcs/message-bus/index.js";
import { onBlock } from "./on-block/index.js";
import { onChainInfo } from "./on-chain-info.js";
import { onL1L2Validator } from "./on-l1-l2-validator.js";
import { onL2RpcNodeAlive, onL2RpcNodeError } from "./on-l2-rpc-node.js";
import { onPendingTxs } from "./on-pending-txs.js";
import { onSequencerInfoEvent } from "./on-sequencer-info.js";

const groupId = `${SERVICE_NAME}-${L2_NETWORK_ID}`;

const chainInfoHandler: EventHandler = {
  groupId,
  cb: onChainInfo as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CHAIN_INFO_EVENT"),
};

const sequencerInfoHandler: EventHandler = {
  groupId,
  cb: onSequencerInfoEvent as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "SEQUENCER_INFO_EVENT"),
};

const l2RpcNodeAliveHandler: EventHandler = {
  groupId,
  cb: onL2RpcNodeAlive as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "L2_RPC_NODE_ALIVE_EVENT"),
};

const l2RpcNodeErrorHandler: EventHandler = {
  groupId,
  cb: onL2RpcNodeError as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "L2_RPC_NODE_ERROR_EVENT"),
};

const blockHandler: EventHandler = {
  groupId,
  cb: onBlock as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "NEW_BLOCK_EVENT"),
};

const catchupHandler: EventHandler = {
  // NOTE: this could be a separate handler when needed
  groupId,
  cb: ((event: NewBlockEvent) => {
    logger.info(`Catchup block event`);
    return onBlock(event);
  }) as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "CATCHUP_BLOCK_EVENT"),
};

const pendingTxHandler: EventHandler = {
  groupId,
  cb: ((event: PendingTxsEvent) => {
    return onPendingTxs(event);
  }) as (arg0: unknown) => Promise<void>,
  topic: generateL2TopicName(L2_NETWORK_ID, "PENDING_TXS_EVENT"),
};

const l1L2ValidatorHandler: EventHandler = {
  groupId,
  cb: onL1L2Validator as (arg0: unknown) => Promise<void>,
  topic: generateL1TopicName(
    L2_NETWORK_ID,
    getL1NetworkId(L2_NETWORK_ID),
    "L1_L2_VALIDATOR_EVENT"
  ),
};

export const subscribeHandlers = async () => {
  await startSubscribe(chainInfoHandler);
  await startSubscribe(sequencerInfoHandler);
  await startSubscribe(l2RpcNodeAliveHandler);
  await startSubscribe(l2RpcNodeErrorHandler);
  await startSubscribe(blockHandler);
  await startSubscribe(catchupHandler);
  await startSubscribe(pendingTxHandler);
  await startSubscribe(l1L2ValidatorHandler);
};
