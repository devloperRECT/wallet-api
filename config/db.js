// Import Neon client and dotenv config
import { neon } from '@neondatabase/serverless';
import "dotenv/config";

// Get the database URL from environment variables
const sql = neon(process.env.DATABASE_URL);

// Example function to test the connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('Connected! Time:', result[0].now);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Optionally: export the `sql` client for use in other files
export default sql;
