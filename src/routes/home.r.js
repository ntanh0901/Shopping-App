const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.c');

router.get('/', productController.index);
router.get('/page', productController.getPage);
router.get('/search', productController.getSearch);
router.get('/cart', (req, res) => {
    res.render('client/cart', {
        title: 'Giỏ hàng'
    })
});
router.get('/checkout', (req, res) => {
    res.render('client/checkout', {
        title: 'Thanh toán'
    })
});

router.get('/wallet', (req, res) => {
    res.render('client/wallet', {
        title: 'Ví tiền'
    })
})
router.get('/products/:slug', productController.show);


module.exports = router;