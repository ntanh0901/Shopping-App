const express = require('express');
const router = express.Router();
const passport = require('passport');
const accountController = require('../controllers/account.c');

router.get('/', (req, res) => {
    if (req.user) {
        if (req.user.LaAdmin === '1') {
            res.redirect('/admin');
        }
        else {
            res.redirect('/client');
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
            res.redirect('/client');
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
            res.redirect('/client');
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
            res.redirect('/client');
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
    successRedirect: '/client'
}));

router.get('/logout', accountController.revokeToken, (req, res) => {
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

router.get('/currentUser', (req, res) => {
    if (req.user) {
        res.json(req.user);
    }
    else {
        res.json(false);
    }
})

module.exports = router;