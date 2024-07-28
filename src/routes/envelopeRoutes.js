const express = require('express');
const { createEnvelope } = require('../controllers/envelopeController');

const router = express.Router();

router.post('/', createEnvelope);

module.exports = router;