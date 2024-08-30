import { L2Block } from "@aztec/aztec.js";
import sequelize, { DataTypes, Model, Sequelize } from "sequelize";
import { logger } from "../../logger.js";

interface IL2Block extends Model {
  number: number;
  hash: Buffer;
  timestamp: Date;
  archive: unknown;
  header: unknown;
  body: unknown;
}
let m: sequelize.ModelStatic<IL2Block>;
const MODEL_NAME = "l2Block";

export const init = async (seq: Sequelize) => {
  m = seq.define<IL2Block>(
    MODEL_NAME,
    {
      hash: { type: DataTypes.BLOB, primaryKey: true },
      number: { type: DataTypes.INTEGER },
      timestamp: { type: DataTypes.DATE },
      archive: { type: DataTypes.JSONB },
      header: { type: DataTypes.JSONB },
      body: { type: DataTypes.JSONB },
    },
    {
      createdAt: false,
      updatedAt: false,
    }
  );
  if (process.env.NODE_ENV === "development") {
    await m.sync({ force: true });
  } else {
    logger.warn(
      "WARNING! since we are not in development mode, we are not forcing the sync of the model."
    );
    // TODO: do model migration here instead
    await m.sync();
  }
};

const getLatest = async () => {
  logger.info(`Getting latest block...`);
  return m.findOne({ order: [["number", "DESC"]] });
};

const store = async (block: L2Block) => {
  logger.info(`Storing block ${block.number}...`);
  return m.upsert({
    number: block.number,
    hash: block.hash() as Buffer,
    timestamp: block.getStats().blockTimestamp,
    archive: block.archive,
    header: block.header,
    body: block.body,
  });
};

export const publicFunctions = {
  getLatest,
  store,
};
