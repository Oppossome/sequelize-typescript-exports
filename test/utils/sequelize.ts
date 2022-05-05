import { Sequelize, ModelCtor } from "sequelize-typescript";
import sequelizeFixtures from "sequelize-fixtures";
import path from "path";
import fs from "fs";

export async function LoadSequelize(fixtures?: string) {
  const modelDir = path.join(__dirname + "/../models/");
  let models: { [key: string]: ModelCtor } = {};

  fs.readdirSync(modelDir).forEach((file) => {
    const moduleFile = path.join(modelDir, file);
    models = { ...models, ...require(moduleFile) };
  });

  const sequelize = await new Sequelize("sqlite::memory:", {
    models: Object.values(models),
    logging: false,
  })

  await sequelize.sync({ force: true })
  if (fixtures) await sequelizeFixtures.loadFile(fixtures, models)
  return sequelize;
}
