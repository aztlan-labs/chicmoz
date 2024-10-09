import { L2Block } from "@aztec/aztec.js";
import { NewBlockEvent } from "@chicmoz-pkg/message-registry";
import { chicmozL2BlockSchema, type ChicmozL2Block } from "@chicmoz-pkg/types";
import { logger } from "../logger.js";
import { sendBlockToClients } from "../ws-server/index.js";

export const onBlock = ({ block }: NewBlockEvent) => {
  if (!block) {
    logger.error("🚫 Block is empty");
    return;
  }
  const b = L2Block.fromString(block);
  const parsedBlock = parseBlock(b);
  if (parsedBlock) sendBlockToClients(parsedBlock);
};

const getTxEffectWithHashes = (txEffects: L2Block["body"]["txEffects"]) => {
  return txEffects.map((txEffect) => {
    return {
      ...txEffect,
      hash: "0x" + txEffect.hash().toString("hex"),
    };
  });
};

const parseBlock = (b: L2Block): ChicmozL2Block | undefined => {
  let parsedBlock: ChicmozL2Block;
  const blockHash = b.hash();
  const blockWithTxEffectsHashesAdded = {
    ...b,
    body: {
      ...b.body,
      txEffects: getTxEffectWithHashes(b.body.txEffects),
    },
  };
  try {
    logger.info(`👓 Parsing block ${b.number}`);
    parsedBlock = chicmozL2BlockSchema.parse({
      hash: blockHash.toString(),
      height: b.number,
      ...JSON.parse(JSON.stringify(blockWithTxEffectsHashesAdded)),
    });
  } catch (e) {
    logger.error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Failed to parse block ${b.number}: ${e}`
    );
    return;
  }
  return parsedBlock;
};
