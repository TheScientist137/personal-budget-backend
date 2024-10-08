require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const envelopeRoutes = require('./src/routes/envelopeRoutes'); // Router
const transactionRoutes = require('./src/routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', envelopeRoutes);
app.use('/api', transactionRoutes);

app.listen(PORT, () => {
 console.log(`Server listening on PORT: ${PORT}`);
});