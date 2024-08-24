import { Logger } from "@chicmoz-pkg/logger-server";
import autoBind from "auto-bind";
import sequelize, { DataTypes, Model } from "sequelize";

interface IlatestProcessedHeight extends Model {
  id: number;
  height: number;
}

export class DB {
  sequelize: sequelize.Sequelize;
  Model: sequelize.ModelStatic<IlatestProcessedHeight>;
  logger: Logger;
  neworkId: string;

  constructor(deps: { sequelize: sequelize.Sequelize; logger: Logger; networkId: string }) {
    this.sequelize = deps.sequelize;
    this.logger = deps.logger;
    this.neworkId = deps.networkId;

    this.Model = this.sequelize.define<IlatestProcessedHeight>(
      "latestProcessedHeight",
      {
        networkId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        height: {
          type: DataTypes.INTEGER,
        },
      },
      {
        tableName: `chain-indexers-latest-processed-height`,
      },
    );

    autoBind(this);
  }

  async sync() {
    this.logger.info("Syncing model...");
    await this.Model.sync();
  }

  storeHeight(height: number) {
    return this.Model.upsert({ networkId: this.neworkId, height });
  }

  getHeight(): Promise<IlatestProcessedHeight | null> {
    return this.Model.findOne({ where: { networkId: this.neworkId } });
  }
}
