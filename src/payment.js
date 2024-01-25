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

app.get('/returnBill', async (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASHSECRET;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        const orderInfo = vnp_Params.vnp_OrderInfo;
        const id = orderInfo.substring(2, orderInfo.length);
        console.log(id);
        const amount = vnp_Params.vnp_Amount;
        const result = await model.updateBalance(id, amount);
        res.redirect('http://localhost:3000/customer');
        //res.render('success', {code: vnp_Params['vnp_ResponseCode']});
    } else{
        console.log('error return bill');
        //res.render('success', {code: '97'});
    }
});

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

app.listen(PORT, () => {
    console.log(`Payment server is running on port ${PORT}`);
});