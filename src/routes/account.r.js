const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();

router.get('/', (req, res) => {
    if (req.user) {
        if (req.user.LaAdmin === '1') {
            res.redirect('/admin');
        }
        else {
            res.redirect('/customer');
        }
    }
    else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    const messages = req.flash('error');
    if (messages[0] == 'Invalid auth') {
        res.render('login', { wrong: true });
        return;
    }
    if (req.user) {
        if (req.user.LaAdmin === '1') {
            res.redirect('/admin');
        }
        else {
            res.redirect('/customer');
        }
        return;
    }
    let username = null;
    let pw = null;
    // Ghi nhớ đăng nhập
    if (req.signedCookies.info) {
        const info = JSON.parse(req.signedCookies.info);
        username = info.u;
        pw = info.pw;
    }
    res.render('login', {
        title: 'Login page',
        username: username,
        password: pw,
    });
});

router.post('/login', passport.authenticate('passport-login', {
    failureRedirect: '/',
    failureFlash: true
}), (req, res) => {
    try {
        // Ghi đăng nhập cũ vào input
        const Username = req.body.username;
        const Password = req.body.password;
        const RememberPw = req.body.rememberPw;
        if (RememberPw) {
            const info = { u: Username, pw: Password };
            const timeout = 60 * 60 * 1000;
            const expires = new Date(Date.now() + timeout);
            res.cookie('info', JSON.stringify(info), { signed: true, expires: expires });
        }
        else {
            res.clearCookie('info');
        }
    }
    catch (e) {
        console.log(e);
    }
    if (req.user) {
        if (req.user.LaAdmin === '1') {
            res.redirect('/admin');
        }
        else {
            res.redirect('/getAccessToken');
        }
    }
    else {
        res.redirect('/login');
    }
});

router.get('/signup', (req, res) => {
    if (req.user) {
        if (req.user.LaAdmin === '1') {
            res.redirect('/admin');
        }
        else {
            res.redirect('/customer');
        }
        return;
    }
    const messages = req.flash('error');
    if (messages[0] == 'Invalid auth') {
        res.render('signup', { existed: true });
        return;
    }
    res.render('signup', {
        title: 'Signup page'
    });
});

router.post('/signup', passport.authenticate('passport-signup', {
    failureRedirect: '/signup',
    failureFlash: true,
    successRedirect: '/customer'
}));


router.post('/logout', async (req, res) => {
    try {
        console.log('get access token');
        const response = await fetch("http://localhost:3001/logout", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: req.session.refreshToken }),
        });

        const data = await response;

        console.log('delete success');

    } catch (error) {
        console.log('Get access token error: ' + error);
    }
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

router.get('/gg', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/gg/auth', passport.authenticate('google', {
    failureRedirect: '/login'
}),
    function (req, res) {
        res.redirect('/client');
    });


router.get('/fb', passport.authenticate('facebook'));

router.get('/fb/auth', passport.authenticate('facebook', {
    failureRedirect: '/login'
}),
    function (req, res) {
        res.redirect('/client');
    });

router.get('/getAccessToken', async (req, res) => {
    try {
        console.log('get access token');
        const response = await fetch("http://localhost:3001/getAccessToken", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Id: req.user.MaND }),
        });

        const data = await response.json();

        console.log(data);

        req.session.accessToken = data.accessToken;
        req.session.refreshToken = data.refreshToken;

        console.log(req.accessToken);

        res.redirect('/customer');

    } catch (error) {
        console.log('Get access token error: ' + error);
    }
});

router.get('/refreshToken', async (req, res) => {
    console.log('refreshing token');
    try {
        const response = await fetch("http://localhost:3001/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: req.session.refreshToken }),
        });

        const data = await response.json();
        console.log('got new access token: ');
        req.session.accessToken = data.accessToken;

        res.redirect('/customer');

    } catch (error) {
        console.log('Refresh token error: ' + error);
    }
})

router.get('/customer', async (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    }
    console.log('got access token');
    console.log(req.session.accessToken);
    try {
        const response = await fetch("http://localhost:3001/getBalance", {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + req.session.accessToken
            }
        });

        const preData = await response;
        const data = await preData.json();
        console.log('get balance data: ');
        console.log(data);

        res.render('home');

    } catch (error) {
        res.redirect('/refreshToken');
        //console.log('Get balance error: ' + error);
    }
});


router.post('/create_payment_url', function (req, res, next) {
    // const ipAddr = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress;

    const ipAddr = '127.0.0.1'
    //var config = require('config');
    const dateFormat = require('dateformat');


    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    const date = new Date();

    const createDate = dateFormat(date, 'yyyymmddHHmmss');
    const orderId = dateFormat(date, 'HHmmss');

    const amount = 100000;
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
});


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

module.exports = router;