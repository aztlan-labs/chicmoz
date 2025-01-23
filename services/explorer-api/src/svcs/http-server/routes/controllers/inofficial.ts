import { NODE_ENV } from "@chicmoz-pkg/microservice-base";
import {
  L1L2ValidatorStatus,
  chicmozL1L2ValidatorHistorySchema,
  chicmozL1L2ValidatorSchema,
} from "@chicmoz-pkg/types";
import asyncHandler from "express-async-handler";
import { PUBLIC_API_KEY } from "../../../../environment.js";
import { getEntry, setEntry } from "../../../cache/index.js";
import { controllers as db } from "../../../database/index.js";
import {
  address,
  blockHash,
  blockHeight,
  classId,
  functionSelector,
  getL1L2ValidatorSchema,
  heightOrHash,
  paths,
  txEffectHash,
  txEffectIndex,
  version,
} from "../paths_and_validation.js";
import { dbWrapper } from "./utils/index.js";

const SUB_PATH = `/v1/${PUBLIC_API_KEY}`;

export const GET_ROUTES = asyncHandler(async (_req, res) => {
  const cachedHtml = await getEntry(["GET_ROUTES"]);
  if (cachedHtml) {
    res.send(cachedHtml);
    return;
  }
  const block = await db.signOfLife.getABlock();
  const blockAndTxEffect = await db.signOfLife.getABlockWithTxEffects();
  const blockAndAContractInstance =
    await db.signOfLife.getABlockWithContractInstances();
  const { privateFunction, unconstrainedFunction } =
    await db.signOfLife.getL2ContractFunctions();
  const somePrivateLogsTxEffects =
    await db.signOfLife.getSomeTxEffectWithPrivateLogs();
  const someUnencryptedLogsTxEffects =
    await db.signOfLife.getSomeTxEffectWithUnencryptedLogs();
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
      paths.txEffectsByTxEffectHash.replace(
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
    r.push(paths.txEffectsByTxEffectHash + "NOT FOUND");
  }

  if (blockAndAContractInstance) {
    r.push(
      paths.contractClass
        .replace(
          `:${classId}`,
          blockAndAContractInstance.contractInstance.classId
        )
        .replace(
          `:${version}`,
          blockAndAContractInstance.contractInstance.version.toString()
        )
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
  if (privateFunction) {
    r.push(
      paths.contractClassPrivateFunctions.replace(
        `:${classId}`,
        privateFunction.classId
      )
    );
    r.push(
      paths.contractClassPrivateFunction
        .replace(`:${classId}`, privateFunction.classId)
        .replace(
          `:${functionSelector}`,
          privateFunction.functionSelector.toString()
        )
    );
  }
  if (unconstrainedFunction) {
    r.push(
      paths.contractClassUnconstrainedFunctions.replace(
        `:${classId}`,
        unconstrainedFunction.classId
      )
    );
    r.push(
      paths.contractClassUnconstrainedFunction
        .replace(`:${classId}`, unconstrainedFunction.classId)
        .replace(
          `:${functionSelector}`,
          unconstrainedFunction.functionSelector.toString()
        )
    );
  } else {
    r.push(paths.contractClassPrivateFunctions + "NOT FOUND");
    r.push(paths.contractClassUnconstrainedFunctions + "NOT FOUND");
  }

  r.push(paths.chainInfo);
  r.push(paths.chainErrors);

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
      <h2>Some tx effects with logs</h2>
      <h3>Private logs</h3>
      <ul>
        ${somePrivateLogsTxEffects
          ?.map(
            (hash) =>
              `<li><a href=localhost:5173/tx-effects/${hash}>${hash}</a></li>`
          )
          .join("")}
      </ul>
      <h3>Unencrypted logs</h3>
      <ul>
        ${someUnencryptedLogsTxEffects
          ?.map(
            (hash) =>
              `<li><a href=localhost:5173/tx-effects/${hash}>${hash}</a></li>`
          )
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
  await setEntry(["GET_ROUTES"], html, NODE_ENV === "production" ? 60 : 2);
  res.send(html);
});

const intervals = [
  { label: "day", seconds: 86400, shortLabel: "day" },
  { label: "hour", seconds: 3600, shortLabel: "hr" },
  { label: "minute", seconds: 60, shortLabel: "min" },
  { label: "second", seconds: 1, shortLabel: "sec" },
];

export const formatDuration = (durationSeconds: number, short?: boolean) => {
  for (const interval of intervals) {
    const count = Math.floor(durationSeconds / interval.seconds);
    if (count >= 1) {
      const label = short ? interval.shortLabel : interval.label;
      return `${count} ${label}${count > 1 ? "s" : ""}`;
    }
  }
  return "just now";
};

export const formatTimeSince = (unixTimestamp: number | null, short = true) => {
  if (unixTimestamp === null) return "no timestamp";
  const now = new Date().getTime();
  const secondsSince = Math.round((now - unixTimestamp) / 1000);
  const duration = formatDuration(secondsSince, short);
  if (duration === "just now") return duration;
  return `${duration} ago`;
};

export const GET_L1_L2_VALIDATOR_STATUS_TEXT = asyncHandler(
  async (req, res) => {
    const { attesterAddress } = getL1L2ValidatorSchema.parse(req).params;
    const validator = await dbWrapper.get(
      ["l1", "l2-validators", attesterAddress],
      () => db.l1.getL1L2Validator(attesterAddress)
    );
    const history = await dbWrapper.get(
      ["l1", "l2-validators", attesterAddress, "history"],
      () => db.l1.getL1L2ValidatorHistory(attesterAddress)
    );
    const stringifiedHistory = chicmozL1L2ValidatorHistorySchema
      .parse(JSON.parse(history))
      .sort(
        ([timestampA], [timestampB]) =>
          timestampB.getTime() - timestampA.getTime()
      )
      .map(([timestamp, keyChanged, newValue]) => [
        formatTimeSince(timestamp.getTime()),
        keyChanged,
        newValue,
        timestamp.toISOString(),
      ]);
    const formattedHistory = [
      ["Time since", "Key changed", "New value", "Timestamp"],
      ["", "", "", "<hr>"],
    ]
      .concat(stringifiedHistory)
      .map(
        ([timeSince, keyChanged, newValue, timestamp]) =>
          `<pre>${timeSince.padEnd(40)}${keyChanged.padEnd(
            40
          )}${newValue.padEnd(50)} ${timestamp}</pre>`
      );

    const validatorStatus = chicmozL1L2ValidatorSchema.parse(
      JSON.parse(validator)
    );
    const validatorStatusText = `<pre>
    <b>Status:</b>           ${L1L2ValidatorStatus[validatorStatus.status]}
    <b>Attester address:</b> ${validatorStatus.attester}
    <b>Withdrawer:</b>       ${validatorStatus.withdrawer}
    <b>Proposer:</b>         ${validatorStatus.proposer}
    <b>Stake:</b>            ${validatorStatus.stake}
    <b>First seen at:</b>    ${validatorStatus.firstSeenAt.toISOString()}
    <b>Latest change at:</b> ${validatorStatus.latestSeenChangeAt.toISOString()}
    </pre>`;

    // TODO: add link to the UI once it's ready
    const html = `
    <html>
      <head>
        <title>Aztec Validator Status</title>
      </head>
      <body>
       <h1>Validator status for ${attesterAddress}</h1>
       <pre>Available statuses: ${[0, 1, 2, 3]
         .map((status) => L1L2ValidatorStatus[status].toString())
         .join(", ")}</pre>
       <h2>Current status</h2>
        ${validatorStatusText}
       <h2>History</h2>
        ${formattedHistory.join("")}
      </body>
    </html>
    `;
    res.send(html);
  }
);
