require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const driver = process.env.DB_DRIVER || 'sqlite';

function getPostgresUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const dbname = process.env.DB_NAME || 'leads_test_js';
  const sslmode = process.env.DB_SSLMODE || 'disable';
  return `postgres://${user}:${encodeURIComponent(password)}@${host}:${port}/${dbname}?sslmode=${sslmode}`;
}

let sequelize;
if (driver === 'postgres') {
  sequelize = new Sequelize(getPostgresUrl(), {
    logging: (msg) => console.log(msg),
    dialectOptions: driver === 'postgres' ? {} : undefined,
  });
} else {
  const dbPath = process.env.DB_PATH || './data.db';
  const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
  const dir = path.dirname(absolutePath);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: absolutePath,
    logging: (msg) => console.log(msg),
  });
}

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log(`Connected to ${driver}`);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    throw err;
  }
}

module.exports = { sequelize, connectDb };
