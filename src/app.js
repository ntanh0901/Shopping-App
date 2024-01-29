const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;
const hbs = require('express-handlebars');
const route = require('./routes');
//---
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

// set view engine 
app.engine('.hbs', hbs.engine({
    extname: '.hbs'
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// set static files
app.use(express.static('public'));

//---
app.use(flash());
const https = require('https');
const fs = require('fs');
const secrect = 'mysecrectkey';
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secrect));
app.use(session({
    secret: secrect,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
// require('./mws/ggpassport')(app);
// require('./mws/fbpassport')(app);
require('./mws/passport')(app);

// app.get('/products', (req, res) => {
//     res.render('client/product', {
//         title: 'Sản phẩm'
//     })
// });

route(app);

// // http
// app.listen(port, () => {
//     console.log(`App listening on port ${port}`);
// })

// https
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app);

server.listen(port, () => console.log(`Listening on port ${port}`));