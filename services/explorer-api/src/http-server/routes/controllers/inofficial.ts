import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  address,
  blockHash,
  blockHeight,
  heightOrHash,
  paths,
  txEffectIndex,
  txHash,
} from "../paths_and_validation.js";

const SUB_PATH = "/v1/d1e2083a-660c-4314-a6f2-1d42f4b944f4";

export const GET_ROUTES = asyncHandler(async (_req, res) => {
  const block = await db.signOfLife.getABlock();
  const blockAndTxEffect = await db.signOfLife.getABlockWithTxEffects();
  const blockAndAContractInstance =
    await db.signOfLife.getABlockWithContractInstances();
  const r = [paths.latestHeight, paths.latestBlock, `${paths.blocks}?from=0`];

  if (block) {
    r.push(paths.block.replace(`:${heightOrHash}`, block.height.toString()));
    r.push(paths.block.replace(`:${heightOrHash}`, block.hash));
  } else {
    r.push(paths.block + "NOT FOUND");
  }

  if (blockAndTxEffect) {
    r.push(
      paths.txEffectsByBlockHeight.replace(
        `:${blockHeight}`,
        blockAndTxEffect.block.height.toString()
      )
    );
    r.push(
      paths.txEffectByBlockHeightAndIndex
        .replace(`:${blockHeight}`, blockAndTxEffect.block.height.toString())
        .replace(
          `:${txEffectIndex}`,
          blockAndTxEffect.txEffects[0].index.toString()
        )
    );
    r.push(
      paths.txEffectsByTxHash.replace(
        `:${txHash}`,
        blockAndTxEffect.txEffects[0].txHash
      )
    );
  } else {
    r.push(paths.txEffectsByBlockHeight + "NOT FOUND");
    r.push(paths.txEffectByBlockHeightAndIndex + "NOT FOUND");
    r.push(paths.txEffectsByTxHash + "NOT FOUND");
  }

  if (blockAndAContractInstance) {
    r.push(
      paths.contractInstancesByBlockHash.replace(
        `:${blockHash}`,
        blockAndAContractInstance.block.hash
      )
    );
    r.push(
      paths.contractInstance.replace(
        `:${address}`,
        blockAndAContractInstance.contractInstance.address
      )
    );
  } else {
    r.push(paths.contractInstancesByBlockHash + "NOT FOUND");
    r.push(paths.contractInstance + "NOT FOUND");
  }

  const statsRoutes = [
    paths.statsTotalTxEffects,
    paths.statsTotalTxEffectsLast24h,
    paths.statsTotalContracts,
    paths.statsAverageFees,
    paths.statsAverageBlockTime,
  ];

  const html = `
  <html>
    <head>
      <title>CHICMOZ API ROUTES</title>
    </head>
    <body>
      <ul>
        ${r.map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`).join("")}
      </ul>
      <br>
      <ul>
        ${statsRoutes.map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`).join("")}
    </body>
  </html>
  `;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.send(html);
});
