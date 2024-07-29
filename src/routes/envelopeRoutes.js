const express = require('express');
const { 
 createEnvelope, 
 getAllEnvelopes,
 getEnvelopeById,
 updateEnvelope,
 deleteEnvelope, 
 transferBudget } = require('../controllers/envelopeController');

const router = express.Router();

// Route to create an envelope
router.post('/envelopes', createEnvelope);
// Route to retrieve all envelopes
router.get('/envelopes', getAllEnvelopes);
// Route to retrieve an especific envelope
router.get('/envelopes/:id', getEnvelopeById);
// Route to update an especific envelope
router.put('/envelopes/:id', updateEnvelope);
// Route to delete an especific envelope
router.delete('/envelopes/:id', deleteEnvelope);
// Route to transfer from one envelope to another
router.post('/envelopes/transfer/:from/:to', transferBudget);

module.exports = router;