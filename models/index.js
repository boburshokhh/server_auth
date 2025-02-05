import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import process from "process";
import configJson from "../config/config.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || "development";
const config = configJson[env];

const sequelize = new Sequelize(process.env.DATABASE_URL, config);

const db = {};

const files = fs.readdirSync(__dirname).filter(file => file.endsWith(".js") && file !== "index.js");

for (const file of files) {
  const modelPath = `file://${path.join(__dirname, file).replace(/\\/g, "/")}`;
  const model = await import(modelPath);
  const modelInstance = model.default(sequelize, DataTypes);
  db[modelInstance.name] = modelInstance;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export const User = db.User;
export default db;
