import asyncHandler from "express-async-handler";
import { controllers as db } from "../../database/index.js";

export const GET_LATEST_HEIGHT = asyncHandler(async (_req, res) => {
  const latestBlock = await db.l2Block.getLatestBlock();
  if (latestBlock?.header.globalVariables.blockNumber)
    res.status(200).send(latestBlock.header.globalVariables.blockNumber);
  else throw new Error("Latest height not found");
});

export const GET_LATEST_BLOCK = asyncHandler(async (_req, res) => {
  const latestBlock = await db.l2Block.getLatestBlock();
  res.status(200).send(JSON.stringify(latestBlock));
});

export const GET_HEALTH = asyncHandler((_req, res) => {
  // TODO: evaluate actual health checks
  //   - db
  //   - message bus
  res.sendStatus(200);
});

//GET_BLOCK: RequestHandler = async (req, res) => {
//  const {
//    params: { heightOrHash },
//  } = getBlockSchema.parse(req);
//  let block;
//  if (isNaN(Number(heightOrHash))) {
//    if (useIndex) block = await this.db.block.getByHash(heightOrHash);
//    else block = await this.db.block.getByHashWithoutIndex(heightOrHash);
//  } else {
//    block = await this.db.block.getByHeight(Number(heightOrHash));
//  }

//   if (!block) throw new NotFoundError("Block not found");
//   res.status(200).send(JSONbig.stringify(block));
// };

// GET_BLOCKS: RequestHandler = async (req, res) => {
//   try {
//     const { start, end } = getBlocksSchema.parse(req).query;

//     if (end < start) throw new Error("Something went wrong: Invalid block range");
//     if (start === end) {
//       res.status(200).send([]);
//       return;
//     }

//     const blockHeight = this.db.block.getBlockHeight();
//     if (blockHeight === -1 || blockHeight < end - 1)
//       throw new Error(`Something went wrong: Block ${blockHeight < start ? start : blockHeight + 1} does not exist in storage`);

//     // TODO: check if this logic can be simplified
//     let blocks;
//     const dbQueryParams = getBlockRangeQueryParams(start, end - 1);

//     if (dbQueryParams.length === 1) {
//       const { start, end, batch } = dbQueryParams[0];
//       blocks = await this.db.block.getBlocksByRange(start, end, batch);
//     } else {
//       const [params1, params2] = dbQueryParams;
//       const blocks1 = await this.db.block.getBlocksByRange(params1.start, params1.end, params1.batch);
//       const blocks2 = await this.db.block.getBlocksByRange(params2.start, params2.end, params2.batch);

//       blocks = blocks1 && blocks2 ? blocks1.concat(blocks2) : undefined;
//     }

//     if (!blocks || blocks.length != end - start) throw new Error("Blocks not found");

//     res.status(200).send(JSONbig.stringify(blocks));
//   } catch (err) {
//     if (err instanceof ZodError) {
//       res.status(400).send({ message: "Schema validation error", errors: err.issues });
//     } else {
//       res
//         .status(500)
//         .type("text/plain")
//         .send(err instanceof Error && err.message ? err.message : "An internal error occurred");
//     }
//   }
// };
