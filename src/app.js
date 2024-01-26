const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;
const hbs = require('express-handlebars');
const route = require('./routes');

// set view engine 
app.engine('.hbs', hbs.engine({
    extname: '.hbs'
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// set static files
app.use(express.static('public'));

app.get('/products', (req, res) => {
    res.render('client/product', {
        title: 'Sản phẩm'
    })
});

route(app);

// http
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})