// Import the Express library
import express from 'express';
import dotenv from 'dotenv';
import sql from './config/db.js'; // Neon SQL client
import transactionsRouter from './router/transactionsRouter.js'
// Load environment variables from .env file
dotenv.config();

// Create an instance of an Express app
const app = express();

// Use PORT from .env or default to 3000
const PORT = process.env.PORT || 3000;



// Enable JSON body parsing
app.use(express.json());
app.use("/transactions",transactionsRouter)
// Initialize the database
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transaction (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Table "transaction" is ready.');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

  
  
// Start server after DB is ready
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
