const fs = require('fs');
const path = require('path');
const db = require('./db');

async function runSchema() {
  try {
    console.log("Reading schema.sql...");
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    console.log("Executing schema.sql against the database...");
    await db.query(schemaSql);
    console.log("Schema executed successfully.\n");
    
    // Verify tables
    const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("Tables found in the 'findback' database:");
    result.rows.forEach(row => console.log(`- ${row.table_name}`));
    process.exit(0);
  } catch (error) {
    console.error("Error executing schema:", error.message);
    process.exit(1);
  }
}

runSchema();
