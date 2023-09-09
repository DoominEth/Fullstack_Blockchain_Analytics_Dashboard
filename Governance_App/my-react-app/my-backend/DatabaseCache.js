const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
});

pool.connect()
  .then(client => {
    console.log('Connected to the database!');
    client.release();  // release the client back to the pool
  })
  .catch(err => {
    console.error('Error connecting to the database!', err);
  });

// DB Datatypes
const columnDefinitions = [
  'block_number INT',
  'transaction_index INT',
  'transaction_hash TEXT',
  'nonce INT',
  'from_address TEXT',
  'to_address TEXT',
  'value TEXT',
  'input TEXT',
  'gas_limit INT',
  'gas_price BIGINT',
  'transaction_type INT',
  'chain_id INT'
].join(', ');

async function ensureTableExists(tableName) {


  const tableExistsQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    );
  `;
  
  const result = await pool.query(tableExistsQuery, [tableName]);
  console.log(`Table ${tableName} exists:`, result.rows[0].exists);
  
  if (!result.rows[0].exists) {
    const createTableQuery = `
      CREATE TABLE ${tableName} (${columnDefinitions});
    `;
    await pool.query(createTableQuery);
  }
}

async function fetchFromCache(tableName, start_block, end_block) {
  await ensureTableExists(tableName);
  
  const rangeQuery = `
    SELECT * 
    FROM ${tableName} 
    WHERE block_number BETWEEN $1 AND $2;
  `;

  const result = await pool.query(rangeQuery, [start_block, end_block]);
  return result.rows;
}

async function insertIntoCache(tableName, data) {
  await ensureTableExists(tableName);

  console.log("Preparsed Data: ", data);

  // No need for parsing as the data is already an object.
  const parsedData = data.data;

  console.log("Parsed Data 0: ", parsedData[0]);

  // Adjusted the way to get column names
  const columns = Object.keys(parsedData[0]); 

for (const block of parsedData) {
    const insertValues = [];

    for (const col of columns) {
        insertValues.push(block[col]);
    }

    console.log("Values:", insertValues);
    const insertColumns = columns.join(", ");

    const insertDataQuery = `
      INSERT INTO ${tableName} (${insertColumns})
      VALUES (${Array.from({ length: insertValues.length }, (_, index) => `$${index + 1}`).join(", ")})
    `;

    console.log("Query:", insertDataQuery);

    await pool.query(insertDataQuery, insertValues);
}
}






module.exports = {
  fetchFromCache,
  insertIntoCache,
};
