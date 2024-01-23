const accountRouter = require('./account.r');
const adminRouter = require('./admin.r');

function route(app) {
    app.use('/', accountRouter);
    app.use('/', adminRouter);
}

module.exports = route;