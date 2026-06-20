// Script to reset the database tables
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

async function main() {
  console.log('Resetting database tables...');
  const { getDb } = await import('../src/lib/db.js');
  const sql = getDb();
  
  // Drop tables in order or with CASCADE
  await sql`DROP TABLE IF EXISTS tokens CASCADE;`;
  await sql`DROP TABLE IF EXISTS queues CASCADE;`;
  await sql`DROP TABLE IF EXISTS clinics CASCADE;`;
  await sql`DROP TABLE IF EXISTS users CASCADE;`;
  
  console.log('✅ Tables dropped successfully.');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error resetting database:', err);
  process.exit(1);
});
