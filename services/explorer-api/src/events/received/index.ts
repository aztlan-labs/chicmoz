import { startSubscribe } from "../../svcs/message-bus/index.js";
import { blockHandler, catchupHandler } from "./on-block/index.js";
import { chainInfoHandler } from "./on-chain-info.js";
import { l1L2ValidatorHandler } from "./on-l1-l2-validator.js";
import {
  l1L2BlockProposedHandler,
  l1L2ProofVerifiedHandler,
} from "./on-l1-rollup-contract-events.js";
import {
  l2RpcNodeAliveHandler,
  l2RpcNodeErrorHandler,
} from "./on-l2-rpc-node.js";
import { pendingTxHandler } from "./on-pending-txs.js";
import { sequencerInfoHandler } from "./on-sequencer-info.js";

export const subscribeHandlers = async () => {
  await startSubscribe(chainInfoHandler);
  await startSubscribe(sequencerInfoHandler);
  await startSubscribe(l2RpcNodeAliveHandler);
  await startSubscribe(l2RpcNodeErrorHandler);
  await startSubscribe(blockHandler);
  await startSubscribe(catchupHandler);
  await startSubscribe(pendingTxHandler);
  await startSubscribe(l1L2ValidatorHandler);
  await startSubscribe(l1L2BlockProposedHandler);
  await startSubscribe(l1L2ProofVerifiedHandler);
};
