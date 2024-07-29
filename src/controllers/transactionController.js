const pool = require('../config/db');

// POST - Create a new transaction and update the envelope's budget
const createTransaction = async (req, res) => {
 const { amount, recipient, envelope_id } = req.body;

 if (!amount || !recipient || !envelope_id) { res.status(400).json({ error: 'Amount, recipient, and envelope ID are required!' }) }

 try {
  // Start transaction
  await pool.query('BEGIN');

  // Check if envelope exists
  const envelopeResult = await pool.query('SELECT * FROM envelopes WHERE id = $1', [envelope_id]);
  if (envelopeResult.rows.length === 0) {
   await pool.query('ROLLBACK');
   return res.status(404).json({ error: 'Envelope NOT FOUND' });
  }

   // Insert new transaction
   const result = await pool.query(
    'INSERT INTO transactions (amount, recipient, envelope_id) VALUES ($1, $2, $3) RETURNING *',
    [amount, recipient, envelope_id]);

    // Update envelope budget with transaction amount
    const newBudget = envelopeResult.rows[0].budget + amount;
    await pool.query(
     'UPDATE envelopes SET budget = $1 WHERE id = $2',
     [newBudget, envelope_id]);

    // Commit transaction
     await pool.query('COMMIT');
    
     res.status(201).json(result.rows[0]);
 } catch(err) {
  await pool.query('ROLLBACK');
  res.status(500).json({ error: err.message });
 }
}

// GET - Get all transactions
const getAllTransactions = async (req, res) => {
 try {
  const result = await pool.query(`
   SELECT t.id, t.amount, t.recipient, t.date, t.envelope_id, e.title as envelope_title
   FROM transactions t
   JOIN envelopes e ON t.envelope_id = e.id`);

  res.status(200).json(result.rows);

 } catch(err) { res.status(500).json({ error: err.message }); }
}

// GET - Get transactions by envelope's id
const getTransactionsByEnvelopeId = async (req, res) => {
 const { envelope_id } = req.params;

 try {
  const result = await pool.query(`
   SELECT t.id, t.amount, t.recipient, t.date, e.title as envelope_title
   FROM transactions t
   JOIN envelopes e ON t.envelope_id = e.id
   WHERE t.envelope_id = $1`, [envelope_id]);
  
  if (result.rows.length === 0) { return res.status(404).json({ error: 'No transactions found for this envelope' }); }

  res.status(200).json(result.rows);

 } catch(err) { res.status(500).json({ error: err.message }); }
}

// PUT - Update an existing transaction
const updateTransaction = async (req, res) => {
 const { id } = req.params;
 const { envelope_id, amount, recipient } = req.body;

 try {
  // Try if the transaction exists
  const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
  if (transaction.rows.length === 0) { res.status(404).json({ error: 'Transaction NOT FOUND' }); }

  // Update the transaction information
  const result = await pool.query(
   'UPDATE transactions SET envelope_id = $1, amount = $2, recipient = $3, date = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
   [envelope_id, amount, recipient, id]);

  res.status(200).json(result.rows[0]);

 } catch(err) { res.status(500).json({ error: err.message }); }
}

// DELETE - Delete a specific transaction
const deleteTransaction = async (req, res) => {
 const { id } = req.params;

 try {
  const transaction = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
  if (transaction.rows.length === 0) { res.status(404).json({ error: 'Transaction NOT FOUND' }); }

  // Delete transaction
  await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
  res.status(200).json({ message: 'Transaction deleted succesfully' });

 } catch(err) { res.status(500).json({ error: err.message }); }
}

module.exports = { 
 createTransaction, 
 getAllTransactions, 
 getTransactionsByEnvelopeId, 
 updateTransaction, 
 deleteTransaction };
