// transactionController.js
import sql from '../config/db.js';
 
export async function getTransationsById(req, res) {
    const { user_id } = req.params;
  
    try {
      const transactions = await sql`
        SELECT * FROM transaction WHERE user_id = ${user_id} ORDER BY created_at DESC;
      `;
  
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // POST /transactions
export async function createTransaction(req, res) {
    const { user_id, title, description, amount, category } = req.body;
  
    if (!user_id || !title || !description || amount === undefined || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    try {
      const result = await sql`
        INSERT INTO transaction (user_id, title, description, amount, category)
        VALUES (${user_id}, ${title}, ${description}, ${amount}, ${category})
        RETURNING *;
      `;
      res.status(201).json({ success: true, transaction: result[0] });
    } catch (error) {
      console.error('❌ Failed to insert transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // DELETE /transactions/:id
  export async function deleteTransaction(req, res) {
    const { id } = req.params;
  
    try {
      const result = await sql`
        DELETE FROM transaction WHERE id = ${id} RETURNING *;
      `;
  
      if (result.length === 0) {
        return res.status(404).json({ error: 'Transaction not found.' });
      }
  
      res.status(200).json({ success: true, message: 'Transaction deleted.', transaction: result[0] });
    } catch (error) {
      console.error('❌ Failed to delete transaction:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // GET /transactions/:user_id/summary
  export async function getTransactionSummary(req, res) {
    const { user_id } = req.params;
  
    try {
      const transactions = await sql`
        SELECT amount FROM transaction WHERE user_id = ${user_id};
      `;
  
      let income = 0;
      let expense = 0;
  
      for (const tx of transactions) {
        const amt = parseFloat(tx.amount);
        if (amt > 0) income += amt;
        else expense += amt;
      }
  
      const balance = income + expense;
  
      res.status(200).json({
        success: true,
        user_id,
        balance: parseFloat(balance.toFixed(2)),
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(Math.abs(expense.toFixed(2))),
      });
    } catch (error) {
      console.error('❌ Failed to fetch summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }