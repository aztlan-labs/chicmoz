import { Logger } from "@chicmoz-pkg/logger-server";
import autoBind from "auto-bind";
import sequelize, { DataTypes, Model } from "sequelize";

interface IApiKey extends Model {
  id: number;
  apiKey: string;
}

export class DB {
  sequelize: sequelize.Sequelize;
  Model: sequelize.ModelStatic<IApiKey>;
  logger: Logger;

  constructor(deps: { sequelize: sequelize.Sequelize; logger: Logger }) {
    this.sequelize = deps.sequelize;
    this.logger = deps.logger;

    this.Model = this.sequelize.define<IApiKey>(
      "API-Key",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        apiKey: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
      },
      {
        tableName: "auth_api-keys",
        indexes: [{ unique: true, fields: ["apiKey"] }, { fields: ["apiKey"] }],
      },
    );

    autoBind(this);
  }

  async sync() {
    this.logger.info("Syncing model...");
    await this.Model.sync();
  }

  register(apiKey: string) {
    return this.Model.findOrCreate({
      where: { apiKey },
      defaults: { apiKey },
    });
  }

  delete(apiKey: string) {
    return this.Model.destroy({
      where: { apiKey },
    });
  }
  
  getByApiKey(apiKey: string) {
    return this.Model.findOne({ where: { apiKey } });
  }
}
