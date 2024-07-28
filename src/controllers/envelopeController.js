const pool = require('../config/db');

// Create a new envelope
const createEnvelope = async (req, res) => {
 const { title, budget, user_id } = req.body;

 if (!title || !budget || !user_id) {
  return res.status(400).json({ error: 'Title, Budget and User ID are required' });
 }

 try {
  const result = await pool.query(
   'INSERT INTO envelopes (title, budget, user_id) VALUES ($1, $2, $3) RETURNING *',
   [title, budget, user_id]
);
  res.status(201).json(result.rows[0]);

 } catch(err) {
  res.status(500).json({ error: err.message });
 }

}

module.exports = { createEnvelope };