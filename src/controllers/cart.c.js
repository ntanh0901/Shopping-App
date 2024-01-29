const Product = require('../models/product.m');

function addThousandSeparator(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports = {
    getCartList: async (req, res, next) => {
        try {
            const product = await Product.getProduct(req.body.productId);
            product.DonGia = parseInt(product.DonGia);
            const amount = parseInt(req.body.amount);
            product.TongGia = product.DonGia * amount;
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
                    req.session.cart[index].product.TongGia = req.session.cart[index].product.DonGia * req.session.cart[index].amount;
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

    updateCart: (req, res, next) => {
        const id = req.body.productId;
        const amount = parseInt(req.body.amount);
        if(!req.session.cart) {
            console.log("no cart found");
            return;
        }
        let index = req.session.cart.findIndex((element) => {
            return element.id == id;
        });

        req.session.cart[index].amount = amount;
        req.session.cart[index].product.TongGia = req.session.cart[index].product.DonGia * req.session.cart[index].amount;
        res.json('sucess');

    },

    updateChecked: (req, res, next) => {
        const id = req.body.productId;
        if(!req.session.cart) {
            console.log("no cart found");
            return;
        }
        let index = req.session.cart.findIndex((element) => {
            return element.id == id;
        });

        req.session.cart[index].checked = true;
        res.json('sucess');
    },

    index: (req, res, next) => {
        res.render('client/cart', {
            data: req.session.cart,
            title: 'Giỏ hàng'
        })
    }
}