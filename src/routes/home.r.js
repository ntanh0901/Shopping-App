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
router.post('/cart/updateChecked', cartController.updateChecked);
// router.get('/checkout', (req, res) => {
//     res.render('client/checkout', {
//         title: 'Thanh toán'
//     })
// });

router.post('/checkoutSuccess', accountController.checkoutSuccess);

router.post('/checkout', accountController.getAccessToken, accountController.getBalance, async (req, res, next) => {
    if (req.body.muaNgay) {
        console.log('mua ngay');
        const cartItem = await productController.checkoutNow(req, res, next);
        if (!req.session.cart) {
            req.session.cart = [];
        }
        req.session.cart.push(cartItem);
    }
    console.log(req.session.cart);
    let canAfford = true;
    if (req.session.balance < req.body.totalPrice) {
        canAfford = false;
    }
    let data = [];
    for (let i = 0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].checked) {
            data.push(req.session.cart[i]);
        }
    }
    if (req.body.muaNgay) {
        for (let i = 0; i < data.length; i++) {
            data[i].product.DonGia = addThousandSeparator(data[i].product.DonGia * 1000);
        }
        res.render('client/checkout', {
            title: 'Thanh toán',
            balance: addThousandSeparator(req.session.balance),
            totalPrice: addThousandSeparator(data[0].product.DonGia),
            rawTotalPrice: data[0].product.DonGia,
            canAfford: canAfford,
            data: data
        })
    } else {
        for (let i = 0; i < data.length; i++) {
            data[i].product.TongGia = addThousandSeparator(data[i].product.TongGia * 1000);
        }
        res.render('client/checkout', {
            title: 'Thanh toán',
            balance: addThousandSeparator(req.session.balance),
            totalPrice: addThousandSeparator(req.body.totalPrice),
            rawTotalPrice: req.body.totalPrice,
            canAfford: canAfford,
            data: data
        })
    }
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