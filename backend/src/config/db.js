const { Pool } = require('pg');
const env = require('./env');
const logger = require('./logger');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PG pool error');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
