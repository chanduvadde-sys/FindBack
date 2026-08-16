const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default DB first to create the new one
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function createDb() {
  try {
    await client.connect();
    console.log("Connected to default postgres database.");
    
    // Check if findback exists
    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'findback'`);
    if (res.rowCount === 0) {
      console.log("Creating findback database...");
      await client.query('CREATE DATABASE findback;');
      console.log("Database 'findback' created successfully.");
    } else {
      console.log("Database 'findback' already exists.");
    }
  } catch (err) {
    console.error("Database creation failed:", err.message);
    if (err.message.includes("password authentication failed")) {
      console.error("\nWHY IT FAILED: The default password 'postgres' is incorrect. You need to set the DB_PASSWORD in your backend/.env file to match your PostgreSQL password.");
    } else if (err.message.includes("ECONNREFUSED")) {
      console.error("\nWHY IT FAILED: PostgreSQL is not running on localhost:5432. Please ensure PostgreSQL is installed and the service is running.");
    }
  } finally {
    await client.end();
  }
}

createDb();
