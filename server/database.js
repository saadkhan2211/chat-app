const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "saadkhan2211",
  host: "localhost",
  port: "5432",
  database: "personal",
});

module.exports = pool;
