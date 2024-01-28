const model = require('../models/payment.m');
const jwt = require('jsonwebtoken');

module.exports = {
    getBalance: async (req, res) => {
        const account = await model.getAccountByID(req.paymentAccount.id);
        let balance = 0;
        if (!account) {
            const newAccount = {
                ID: req.paymentAccount.id,
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
        res.json({ balance: balance });
    },

    authenticateToken:(req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null) return res.sendStatus(401);
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.paymentAccount = user;
            next();
        })
    },

    getAccessToken: async (req, res) => {
        const Id = req.body.Id;
        const user = { id: Id };
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        model.insertRefreshToken(refreshToken);
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    },

    getNewAccessToken: (req, res) => {
        const refreshToken = req.body.refreshToken;
        if (refreshToken === null) return res.sendStatus(401);
        if (!model.checkRefreshToken(refreshToken)) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ id: user.id });
            res.json({ accessToken: accessToken });
        })
    },

    deleteRefreshToken: async (req, res) => {
        const refreshToken = req.body.refreshToken;
        await model.deleteRefreshToken(refreshToken);
        res.sendStatus(204);
    },

    returnBill: async (req, res) => {
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
            const amount = parseInt(vnp_Params.vnp_Amount) / 100;
            console.log(amount);
            const result = await model.updateBalance(id, amount);
            res.redirect('http://localhost:3000/client/wallet');
            //res.render('success', {code: vnp_Params['vnp_ResponseCode']});
        } else{
            console.log('error return bill');
            //res.render('success', {code: '97'});
        }
    }
}

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

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}