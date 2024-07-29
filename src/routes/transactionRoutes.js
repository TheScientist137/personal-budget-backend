const express = require('express');
const { 
 createTransaction, 
 getAllTransactions, 
 getTransactionsByEnvelopeId, 
 updateTransaction,
 deleteTransaction } = require('../controllers/transactionController');

const router = express.Router();

router.post('/transactions', createTransaction);
router.get('/transactions', getAllTransactions);
router.get('/transactions/:envelope_id', getTransactionsByEnvelopeId);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

module.exports = router;