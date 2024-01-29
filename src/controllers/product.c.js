const Product = require('../models/product.m');
const Account = require('../models/account.m');
//const { search } = require('../routes/home.r');

module.exports = {
    // Add: async (req, res, next) => {
    //     try {
    //         const MaSP = req.body.MaSP;
    //         const Ten = req.body.Ten;
    //         const DonGia = req.body.DonGia;
    //         const SoLuongTon = req.body.SoLuongTon;
    //         const Anh = req.body.Anh;
    //         const MaLoai = req.body.MaLoai;

    //         await Product.insert(MaSP, Ten, DonGia, SoLuongTon, Anh, MaLoai);

    //         res.redirect('/');
    //     } catch (error) {
    //         next(error);
    //     }
    // },

    getPage: async (req, res, next) => {
        try {
            const type = req.query.type || 'Tất cả';
            const orderBy = req.query.orderBy || null;
            const isDesc = req.query.isDesc || null;
            const searchInput = req.query.search || null;
            let data = null;
            if (searchInput === null) {
                if (type === 'Tất cả') {
                    data = await Product.getAll(orderBy, isDesc);
                } else {
                    data = await Product.getBy(type, orderBy, isDesc);
                }
            } else {
                if (type === 'Tất cả') {
                    data = await Product.getSearch(searchInput);
                } else {
                    data = await Product.getByWithSearch(type, orderBy, isDesc, searchInput);
                }
            }

            const total = data.length;

            const currentPage = req.query.page || 1;
            const itemsPerPage = 5;

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            data = data.slice(startIndex, endIndex);

            res.json({
                data: data,
                perpage: itemsPerPage,
                total: total,
                type: type
            });
        } catch (error) {
            console.log('Product page error: ', error);
        }
    },

    getSearch: async (req, res, next) => {
        try {
            const input = req.query.input;
            let data = null;
            data = await Product.getSearch(input);

            const total = data.length;

            const currentPage = req.query.page || 1;
            const itemsPerPage = 5;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            data = data.slice(startIndex, endIndex);

            res.json({
                data: data,
                perpage: itemsPerPage,
                total: total,
                type: 'Tất cả'
            });
        } catch (error) {
            console.log('Search page error: ', error);
        }
    },

    index: async (req, res) => {
        if (!req.user) {
            res.redirect('/login');
            return;
        }
        try {
            const data = await Product.getType();
            res.render('client/home', {
                title: 'Home',
                type: data
            });
        }
        catch (err) {
            console.log('Get type err: ', err);
        }
    },

    show: async (req, res) => {
        try {
            const product = await Product.getProduct(req.params.slug);
            const similar = await Product.getSimilar(product.MaLoai, product.MaSP);
            res.render('client/product', {
                product: product,
                similar: similar,
                title: product.Ten
            });
        }
        catch (err) {
            console.log('err type: ', err);
        }
    },

    checkoutNow: async (req, res, next) => {
        const id = req.body.maSP;
        const product = await Product.getProduct(id);
        const cartItem = {
            id: parseInt(id),
            product: product,
            amount: 1,
            checked: true
        };
        return cartItem;
    },

    getMyOrders: async (req, res, next) => {
        const id = req.user.MaND;
        let data = { orders: [] };
        const hoaDon = await Account.getAllHoaDon(id);
        for (let i = 0; i < hoaDon.length; i++) {
            let order = {
                hoaDon: hoaDon[i],
                chiTiet: []
            };
            let chiTiet = await Account.getAllChiTietHoaDon(hoaDon[i].MaHD);
            console.log(chiTiet);
            for (let j = 0; j < chiTiet.length; j++) {
                const product = await Product.getProduct(chiTiet[j].MaSP);
                chiTiet[j].product = product;
                order.chiTiet.push(chiTiet[j]);
            }
            data.orders.push(order);
        }

        console.log(data.orders);
        
        res.render('client/order', {
            title: 'Đơn hàng của tôi',
            data: data
        });
    }
}