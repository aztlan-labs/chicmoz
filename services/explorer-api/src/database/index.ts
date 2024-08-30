import { Sequelize } from "sequelize";
import {
  POSTGRES_ADMIN,
  POSTGRES_DB_NAME,
  POSTGRES_IP,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} from "../environment.js";
import * as block from "./models/block.js";

export const init = async () => {
  const sequelize = new Sequelize(
    POSTGRES_DB_NAME,
    POSTGRES_ADMIN,
    POSTGRES_PASSWORD,
    {
      dialect: "postgres",
      host: POSTGRES_IP,
      port: POSTGRES_PORT,
      logging: false,
    }
  );
  await sequelize.authenticate();

  await block.init(sequelize);

  // TODO: sync models
  // TODO: log if starting with an empty DB
  return {
    shutdownDb: async () => {
      await sequelize.close();
    },
  };
};

export const blockDB = {
  ...block.publicFunctions,
};
