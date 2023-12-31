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
  'transaction_hash TEXT UNIQUE',
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
  WHERE block_number BETWEEN $1 AND $2
  ORDER BY block_number ASC;
`;


  const result = await pool.query(rangeQuery, [start_block, end_block]);
  return result.rows;
}


async function insertIntoCache(tableName, data) {
    await ensureTableExists(tableName);
    if (data.length === 0) return;

    const columns = Object.keys(data[0]);
    const insertColumns = columns.join(", ");

    // Build the placeholders for each row of data
    const placeholders = data.map((_, rowIndex) => {
        return `(${columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ')})`;
    }).join(', ');

    // Flatten the data for parameter binding
    const insertValues = data.flatMap(row => columns.map(col => row[col]));

    // Use ON CONFLICT to avoid inserting duplicates
    const onConflictDoNothing = `
      ON CONFLICT (transaction_hash) DO NOTHING
    `;

    const insertDataQuery = `
      INSERT INTO ${tableName} (${insertColumns})
      VALUES ${placeholders}
      ${onConflictDoNothing}
    `;

    await pool.query(insertDataQuery, insertValues);
}


module.exports = {
  fetchFromCache,
  insertIntoCache,
};
