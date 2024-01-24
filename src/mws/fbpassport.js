const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const AccountModel = require('../models/account.m');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `https://localhost:3000/fb/auth`,
},
    async function (accessToken, refreshToken, profile, done) {
        let rs = await AccountModel.getUserByUsername(profile.id);
        if (!rs) {
            try {
                rs = new AccountModel(profile.displayName, null, null, null, profile.id, null, null, null, '1', '0', '0', null, null);
                await AccountModel.insert(rs);
            }
            catch (e) {
                console.log("Passport login error: ", e);
            }
        }
        // console.log(profile);
        return done(null, profile);
    }));

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());
}