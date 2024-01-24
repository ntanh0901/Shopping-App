const { Strategy } = require('passport-strategy');
const passport = require('passport');

module.exports = class MyStrategy extends Strategy {
    constructor(verify, options) {
        super();
        this.name = 'myS'; // Set a name for your strategy
        this.verify = verify; // Set the verify function for authentication
        this.usernameField = (options && options.username) ? options.username : 'username';
        this.passwordField = (options && options.password) ? options.password : 'password';
        passport.strategies[this.name] = this;
    }

    authenticate(req, options) {
        // Implement the authentication login here
        // Call this.success(user, info) if authentication is successful
        // Call this.fail(info) if authentication fails
        const username = req.body[this.usernameField];
        const password = req.body[this.passwordField];
        this.verify(req, username, password, (err, user) => {
            if (err) {
                return this.fail(err);
            }
            if (!user) {
                return this.fail('Invalid auth');
            }
            this.success(user);
        });
    }
}