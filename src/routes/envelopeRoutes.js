const express = require('express');
const { 
 createEnvelope, 
 getAllEnvelopes,
 getEnvelopeById,
 updateEnvelope,
 deleteEnvelope } = require('../controllers/envelopeController');

const router = express.Router();

// Route to create an envelope
router.post('/', createEnvelope);
// Route to retrieve all envelopes
router.get('/', getAllEnvelopes);
// Route to retrieve an especific envelope
router.get('/:id', getEnvelopeById);
// Route to update an especific envelope
router.put('/:id', updateEnvelope);
// Route to delete an especific envelope
router.delete('/:id', deleteEnvelope);

module.exports = router;