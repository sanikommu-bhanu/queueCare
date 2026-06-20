// Run with: node scripts/init-db.js
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

async function main() {
  console.log('Initializing database...');
  const { initDb } = await import('../src/lib/db.js');
  await initDb();
  console.log('✅ Database initialized successfully!');
  process.exit(0);
}
main().catch(err => { console.error('❌ Error:', err); process.exit(1); });

