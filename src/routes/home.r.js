const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');
const accountController = require('../controllers/account.c');

router.get('/', productController.index);
router.get('/page', productController.getPage);
router.get('/search', productController.getSearch);
router.get('/cart', (req, res) => {
    res.render('client/cart', {
        title: 'Giỏ hàng'
    })
});
router.get('/checkout', accountController.getAccessToken, accountController.getBalance, (req, res, next) => {
    res.render('client/checkout', {
        title: 'Thanh toán',
        balance: addThousandSeparator(req.session.balance)
    })
});

router.post('/rechage', accountController.rechargeMoney);

router.get('/wallet', accountController.getAccessToken, accountController.getBalance, (req, res, next) => {
    res.render('client/wallet', {
        title: 'Ví tiền',
        balance: addThousandSeparator(req.session.balance)
    })
});

router.get('/products/:slug', productController.show);

function addThousandSeparator(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


module.exports = router;