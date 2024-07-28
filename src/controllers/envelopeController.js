const pool = require('../config/db');

// POST - Create new envelope
const createEnvelope = async (req, res) => {
 const { title, budget, user_id } = req.body;

 if (!title || !budget || !user_id) {
  return res.status(400).json({ error: 'Title, Budget and User ID are required' });
 }

 try {
  const result = await pool.query(
   'INSERT INTO envelopes (title, budget, user_id) VALUES ($1, $2, $3) RETURNING *',
   [title, budget, user_id]);

  res.status(201).json(result.rows[0]);

 } catch(err) {
  res.status(500).json({ error: err.message });
 }
}

// GET - Retrieve all envelopes
const getAllEnvelopes = async (req, res) => {
 try {
  const result = await pool.query('SELECT * FROM envelopes');
  res.status(200).json(result.rows);

 } catch(err) {
  res.status(500).json({ error: err.message });
 }
}

// GET - Retrieve a single envelope
const getEnvelopeById = async (req, res) => {
 const { id } = req.params;

 try {
  const result = await pool.query('SELECT * FROM envelopes WHERE id = $1', [id]);

  if (result.rows.length === 0) { return res.status(404).json({ error: 'Envelope NOT FOUND' }); }

  res.status(200).json(result.rows[0]);

 } catch(err) {
  res.status(500).json({ error: err.message });
 }
}

// PUT - Update an existing envelope
const updateEnvelope = async (req, res) => {
 const { id } = req.params;
 const { title, budget, user_id, extractAmount } = req.body;

 try {
  // Validate if the envelope exists
  const envelope = await pool.query('SELECT * FROM envelopes WHERE id = $1', [id]);
  if (envelope.rows.length === 0) { return res.status(404).json({ error: 'Envelope NOT FOUND' }); }

  // Actual budget to be modified
  let newBudget = envelope.rows[0].budget;

  // If extractAmount exists extract it from the budget
  if (extractAmount) {
   if (extractAmount > newBudget) { return res.status(400).json({ error: 'Not enough budget on the envelope' }); }

   newBudget -= extractAmount;
   
    // If no extractAmount but new budget, update with new budget
  } else if (budget != undefined) { newBudget = budget; }

  // Define update values
  const updatedTitle = title !== undefined ? title : envelope.rows[0].title;
  const updatedUserId = user_id !== undefined ? user_id : envelope.rows[0].user_id;
  
  // Update the envelope information
  const result = await pool.query(
   'UPDATE envelopes SET title = $1, budget = $2, user_id = $3 WHERE id = $4 RETURNING *',
   [updatedTitle, newBudget, updatedUserId, id]);

   res.status(200).json(result.rows[0]);

 } catch(err) {
  res.status(500).json({ error: err.message });
 }
}

// DELETE - Delete an especific envelope
const deleteEnvelope = async (req, res) => {
 const { id } = req.params;

 try {
  const envelope = await pool.query('SELECT * FROM envelopes WHERE id = $1', [id]);
  if (envelope.rows.length === 0) { return res.status(404).json({ error: 'Envelope NOT FOUND' }); }

  await pool.query('DELETE FROM envelopes WHERE id = $1', [id]);
  res.status(200).json({ message: 'Envelope deleted succesfully' });

 } catch(err) {
  res.status(500).json({ error: err.message });
 }
}

module.exports = { createEnvelope, getAllEnvelopes, getEnvelopeById, updateEnvelope, deleteEnvelope };