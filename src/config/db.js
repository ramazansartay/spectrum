const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Max connections in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

async function testDBConnection() {
  let retries = 3;
  while (retries) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to the database.');
      client.release();
      return;
    } catch (err) {
      console.error('Failed to connect to the database:', err.message);
      retries -= 1;
      console.log(`Retries left: ${retries}. Retrying in 5 seconds...`);
      if (retries === 0) {
        throw new Error('Could not connect to database after multiple retries.');
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  testDBConnection,
};
