import sequelizeFixtures from "sequelize-fixtures";
import { Sequelize } from "sequelize-typescript";
import * as models from "../models"

export async function LoadSequelize(fixtures?: string) {
  const sequelize = await new Sequelize("sqlite::memory:", {
    models: Object.values(models),
    logging: false,
  })

  await sequelize.sync({ force: true })
  if (fixtures) await sequelizeFixtures.loadFile(fixtures, models)
  return sequelize;
}