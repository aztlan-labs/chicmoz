import asyncHandler from "express-async-handler";
import { controllers as db } from "../../../database/index.js";
import {
  address,
  blockHash,
  blockHeight,
  heightOrHash,
  paths,
  txEffectIndex,
  txEffectHash,
  classId,
  version,
} from "../paths_and_validation.js";
import { NODE_ENV, PUBLIC_API_KEY } from "../../../environment.js";
import { getCache } from "../../../cache/index.js";

const SUB_PATH = `/v1/${PUBLIC_API_KEY}`;

export const GET_ROUTES = asyncHandler(async (_req, res) => {
  const cachedHtml = await getCache().get("GET_ROUTES");
  if (cachedHtml) {
    res.send(cachedHtml);
    return;
  }
  const block = await db.signOfLife.getABlock();
  const blockAndTxEffect = await db.signOfLife.getABlockWithTxEffects();
  const blockAndAContractInstance =
    await db.signOfLife.getABlockWithContractInstances();
  const r = [paths.latestHeight, paths.latestBlock, `${paths.blocks}?from=0`];
  const searchRoutes = [];

  if (block) {
    r.push(paths.block.replace(`:${heightOrHash}`, block.height.toString()));
    r.push(paths.block.replace(`:${heightOrHash}`, block.hash));
    searchRoutes.push(
      `${paths.search}?q=${block.height.toString()}`,
      `${paths.search}?q=${block.hash}`
    );
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
        `:${txEffectHash}`,
        blockAndTxEffect.txEffects[0].hash
      )
    );
    searchRoutes.push(
      `${paths.search}?q=${blockAndTxEffect.txEffects[0].hash}`
    );
  } else {
    r.push(paths.txEffectsByBlockHeight + "NOT FOUND");
    r.push(paths.txEffectByBlockHeightAndIndex + "NOT FOUND");
    r.push(paths.txEffectsByTxHash + "NOT FOUND");
  }

  if (blockAndAContractInstance) {
    r.push(
      paths.contractClass
        .replace(`:${classId}`, blockAndAContractInstance.contractInstance.classId)
        .replace(`:${version}`, blockAndAContractInstance.contractInstance.version.toString())
    );
    r.push(
      paths.contractClassesByClassId.replace(
        `:${classId}`,
        blockAndAContractInstance.contractInstance.classId
      )
    );
    r.push(paths.contractClasses);
    r.push(
      paths.contractInstancesByBlockHash.replace(
        `:${blockHash}`,
        blockAndAContractInstance.block.hash
      )
    );
    r.push(
      paths.contractInstancesByContractClassId.replace(
        `:${classId}`,
        blockAndAContractInstance.contractInstance.classId
      )
    );
    r.push(
      paths.contractInstance.replace(
        `:${address}`,
        blockAndAContractInstance.contractInstance.address
      )
    );
    r.push(paths.contractInstances);
    searchRoutes.push(
      `${paths.search}?q=${blockAndAContractInstance.contractInstance.address}`,
      `${paths.search}?q=${blockAndAContractInstance.contractInstance.classId}`
    );
  } else {
    r.push(paths.contractInstancesByBlockHash + "NOT FOUND");
    r.push(paths.contractInstance + "NOT FOUND");
  }

  const statsRoutes = [
    paths.statsTotalTxEffects,
    paths.statsTotalTxEffectsLast24h,
    paths.statsTotalContracts,
    paths.statsTotalContractsLast24h,
    paths.statsAverageFees,
    paths.statsAverageBlockTime,
  ];

  const html = `
  <html>
    <head>
      <title>CHICMOZ API ROUTES</title>
    </head>
    <body>
      <h2>General routes</h2>
      <ul>
        ${r
          .map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`)
          .join("")}
      </ul>
      <br>
      <h2>Search routes</h2>
      <ul>
        ${searchRoutes
          .map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`)
          .join("")}
      </ul>
      <br>
      <h2>Stats routes</h2>
      <ul>
        ${statsRoutes
          .map((route) => `<li><a href=${SUB_PATH + route}>${route}</a></li>`)
          .join("")}
      </ul>
    </body>
  </html>
  `;
  await getCache().set("GET_ROUTES", html, {
    EX: NODE_ENV === "production" ? 60 : 2,
  });
  res.send(html);
});

export const GET_AZTEC_CHAIN_CONNECTION = asyncHandler(async (_req, res) => {
  const chainConnection = await db.aztecChainConnection.getLatestWithRedactedRpc();
  if (!chainConnection) {
    res.status(404).send("No chain connection found");
    return;
  }
  res.json(chainConnection);
});
