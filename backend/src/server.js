/*const http = require('http')

const server = http.createServer((req, res) => {

    res.writeHead(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify({status : 'ok'}));
});

server.listen(3000, () => {
console.log('Servidor rodando na porta 3000')
})*/


require('dotenv').config();
const { pool } = require('./config/db');

console.log('DB_HOST:' , process.env.DB_HOST);

const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');


async function testDb() {
  const r = await pool.query('SELECT now() as now');
  console.log('DB OK, now =', r.rows[0].now);
}
app.listen(env.port, () => {
  logger.info(`API running on http://localhost:${env.port}`);
});


testDb().then(() => {
  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}).catch((err) => {
  console.error('DB FAIL:', err.message);
  process.exit(1);
});