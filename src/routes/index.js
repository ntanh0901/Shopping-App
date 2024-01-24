const accountRouter = require('./account.r');
const homeRouter = require('./home.r');

function route(app) {
    app.use('/', accountRouter);
    app.use('/', homeRouter);
}

module.exports = route;