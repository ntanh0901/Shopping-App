const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');
const accountController = require('../controllers/account.c');
const cartController = require('../controllers/cart.c');

router.get('/', productController.index);
router.get('/page', productController.getPage);
router.get('/search', productController.getSearch);
router.get('/cart', cartController.index);

router.post('/cart', cartController.getCartList);
router.post('/cart/update', cartController.updateCart);
// router.get('/checkout', (req, res) => {
//     res.render('client/checkout', {
//         title: 'Thanh toán'
//     })
// });

router.post('/checkout', accountController.getAccessToken, accountController.getBalance, (req, res, next) => {
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