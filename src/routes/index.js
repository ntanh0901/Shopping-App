const accountRouter = require('./account.r');
const homeRouter = require('./home.r');
const adminRouter = require('./admin.r');

function route(app) {
    app.use('/', accountRouter);
    app.use('/client', homeRouter);
    app.use('/admin', adminRouter);
}

module.exports = route;