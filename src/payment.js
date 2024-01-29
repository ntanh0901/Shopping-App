require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const route = require('./routes/payment.r');

const app = express();
const PORT = process.env.PAYMENT_PORT || 3001;
app.use(express.json());

app.use('/', route);

app.listen(PORT, () => {
    console.log(`Payment server is running on port ${PORT}`);
});
