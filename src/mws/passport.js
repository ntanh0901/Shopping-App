require('dotenv').config();
const passport = require('passport');
const MyStrategy = require('../utils/customSPP');
const AccountModel = require('../models/account.m');
const bcrypt = require('bcrypt');
const saltBounds = 10;

passport.serializeUser((user, done) => {
    done(null, user.UserName);
});
passport.deserializeUser(async (username, done) => {
    const user = await AccountModel.getUserByUsername(username);
    done(null, user);
});

// Passport xử lí đăng nhập
passport.use('passport-login', new MyStrategy(async (req, username, password, done) => {
    const rs = await AccountModel.getUserByUsername(username);
    if (!rs) {
        return done(null, false, { message: 'Invalid username' });
    }
    let auth;
    if (rs) {
        try {
            auth = await bcrypt.compare(password, rs.MatKhau);
        }
        catch (e) {
            console.log("Passport login error: ", e);
        }
    }
    if (!auth) {
        return done(null, false, { message: 'Invalid password' });
    }
    if (auth) {
        delete rs.MatKhau;
        return done(null, rs);
    }
    //done('Invalid auth');
}, {
    username: 'username',
    password: 'password'
}));

// Passport xử lí đăng kí
passport.use('passport-signup', new MyStrategy(async (req, username, password, done) => {
    let rs = await AccountModel.getUserByUsername(req.body.username);
    if (!rs) {
        try {
            const Fullname = req.body.fullname;
            const Phone = req.body.phone;
            const Birth = req.body.birth;
            const Email = req.body.email;
            const Gender = req.body.gender;
            const Username = req.body.username;
            const Password = req.body.password;
            const HashPW = await bcrypt.hash(Password, saltBounds);
            // Mặc định là khách hàng 
            rs = new AccountModel(Fullname, Phone, Birth, Email, null, Gender, Username, HashPW, '1', '0', null);
            if (await AccountModel.insert(rs) == null) {
                done('Invalid auth');
                return;
            };
        } catch (e) {
            console.log("Passport signup error: ", e);
            done('Invalid auth');
            return;
        }
        delete rs.MatKhau;
        return done(null, rs);
    }
    return done(null, false, { message: 'Invalid username' });
    //done('Invalid auth');
}, {
    username: 'username',
    password: 'password'
}));

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}