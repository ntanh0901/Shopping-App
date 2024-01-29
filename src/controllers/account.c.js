const Account = require('../models/account.m');

module.exports = {
    GetAllAccount: async (req, res) => {
        try {
            const data = await Account.getAll();
            res.render('accountManager_test', {
                data: data,
            })
        }
        catch (error) {
            console.log("GetAllAccount error: ", error);
        }
    },
    EditAccount: async (req, res) => {
        try {
            const Username = req.body.Username;
            let data = await Account.getUserByUsername(Username);
            const dateObject = new Date(data.NgaySinh);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
            const day = String(dateObject.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            data.NgaySinh = formattedDate;
            res.render('editAccount_test', {
                data: data,
            })
        }
        catch (error) {
            console.log("EditAccount error: ", error);
        }
    },
    Save: async (req, res) => {
        try {
            const Id = req.body.id;
            const Fullname = req.body.fullname;
            const Phone = req.body.phone;
            const Birth = req.body.birth;
            const Email = req.body.email;
            const Gender = req.body.gender;
            const Username = req.body.username;
            await Account.update(
                ["HoTen", "SDT", "NgaySinh", "Email", "GioiTinh", "UserName"],
                [Fullname, Phone, Birth, Email, Gender, Username],
                Id
            );
            res.redirect('/accountTest');
        }
        catch (error) {
            console.log("Save error: ", error);
        }
    },

    getAccessToken: async (req, res, next) => {
        if (req.session.accessToken) {
            next();
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/getAccessToken", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Id: req.user.MaND }),
            });

            const data = await response.json();

            req.session.accessToken = data.accessToken;
            req.session.refreshToken = data.refreshToken;

        } catch (error) {
            console.log('Get access token error: ' + error);
        }
        next();
    },

    getNewAccessToken: async (req, res, next) => {
        try {
            const response = await fetch("http://localhost:3001/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: req.session.refreshToken }),
            });

            const data = await response.json();

            req.session.accessToken = data.accessToken;

        } catch (error) {
            console.log('Refresh token error: ' + error);
        }
        await module.exports.getBalance(req, res, next);
    },

    getBalance: async (req, res, next) => {
        try {
            const response = await fetch("http://localhost:3001/getBalance", {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + req.session.accessToken
                }
            });
            const data = await response.json();

            req.session.balance = data.balance;

            next();

        } catch (error) {
            await module.exports.getNewAccessToken(req, res, next);
            //console.log('Get balance error: ' + error);
        }
    },

    rechargeMoney: function (req, res, next) {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const dateFormat = require('dateformat');


        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURNURL;

        const date = new Date();

        const createDate = dateFormat(date, 'yyyymmddHHmmss');
        const orderId = dateFormat(date, 'HHmmss');

        const amount = req.body.moneyValue;
        const bankCode = 'NCB';

        const orderInfo = 'NT' + req.user.MaND;
        const orderType = 'other';
        const locale = 'vn';
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);


        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const crypto = require("crypto");
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log(vnpUrl);
        res.redirect(vnpUrl);
    },

    revokeToken: async (req, res, next) => {
        try {
            const response = await fetch("http://localhost:3001/logout", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: req.session.refreshToken }),
            });

            const data = await response;

        } catch (error) {
            console.log('Revoke access token error: ' + error);
        }
        next();
    }, 

    checkoutSuccess: async (req, res, next) => {
        console.log('Stay still');
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
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