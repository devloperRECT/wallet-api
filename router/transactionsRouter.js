import express from 'express'
import sql from '../config/db.js';
const router = express.Router()
// GET /transactions/:user_id — fetch all transactions for a specific user

  // router file
import { getTransationsById , createTransaction ,deleteTransaction,getTransactionSummary} from '../controllers/transactionController.js'
router.get('/:user_id', getTransationsById);

// POST /transactions — create a new transaction
router.post('/',createTransaction );

// DELETE /transactions/:id — delete a transaction by ID
router.delete('/:id',deleteTransaction );
  // GET /transactions/:user_id/summary — income, expense, balance
  router.get('/:user_id/summary', getTransactionSummary);

export default router;