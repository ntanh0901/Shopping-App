const accountRouter = require('./account.r');

function route(app) {
    app.use('/', accountRouter);
}

module.exports = route;