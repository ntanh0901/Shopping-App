require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const model = require('./models/payment.m');

const app = express();
const PORT = process.env.PAYMENT_PORT || 3001;
app.use(express.json());

app.post('/getBalance', async (req, res) => {
    console.log(req.body);
    const account = await model.getAccountByID(req.body.Id);
    let balance = 0;
    if (!account) {
        const newAccount = {
            ID: req.body.Id,
            SoDu: 0
        };
        try {
            await model.insert(newAccount);
        } catch (error) {
            console.log('Creat new payment account error');
        }
    } else {
        balance = account.SoDu;
    }
    res.json({ status: 'success', balance: balance });
});


app.listen(PORT, () => {
    console.log(`Payment server is running on port ${PORT}`);
});