require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AccountModel = require('../models/account.m');

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Passport xử lí đăng nhập bằng gg
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `http://localhost:3000/gg/auth`
},
    async function (accessToken, refreshToken, profile, done) {
        let rs = await AccountModel.getUserByUsername(profile.id);
        if (!rs) {
            try {
                rs = new AccountModel(profile.displayName, null, null, null, null, null, profile.id, null, '1', '0', null);
                await AccountModel.insert(rs);
            }
            catch (e) {
                console.log("Passport login error: ", e);
            }
        }
        done(null, profile);
    }
));

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}