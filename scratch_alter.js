require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp TEXT, ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP;`;
  console.log('Done');
}
run().catch(console.error);
