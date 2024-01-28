const Product = require('../models/product.m');

module.exports = {
    getCartList: async (req, res, next) => {
        try {
            const product = await Product.getProduct(req.body.productId);
            const amount = parseInt(req.body.amount);
            if (!req.session.cart) {
                req.session.cart = [];
                req.session.cart.push({
                    id: product.MaSP,
                    product: product,
                    amount: amount
                });
            } else {
                const index = req.session.cart.findIndex((element) => {
                    return element.id == product.MaSP;
                });
                if(index >= 0) {
                    req.session.cart[index].amount += amount;
                } else {
                    req.session.cart.push({
                        id: product.MaSP,
                        product: product,
                        amount: amount
                    });
                }
            }
            res.json({
                cartLength: req.session.cart.length
            });
            console.log(req.session.cart);
        }
        catch (err) {
            console.log(err);
        }
    },

    index: (req, res, next) => {
        res.render('client/cart', {
            data: req.session.cart
        })
    }
}