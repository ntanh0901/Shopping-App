const Product = require('../models/product.m');
const Account = require('../models/account.m');
const Categories = require('../models/categories.m');

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

    getProducts: async (req, res, next) => {
        try {
            const type = req.query.type || 'Tất cả';
            const orderBy = req.query.orderBy || "MaSP";
            const isDesc = req.query.isDesc || false;
            let data = null;
            if (type === 'Tất cả') {
                data = await Product.getAllProductsWithType(orderBy, isDesc);
            } else {
                data = await Product.getBy(type, orderBy, isDesc);
            }
            // console.log(data);
            const total = data.length;

            const currentPage = req.query.page || 1;
            const itemsPerPage = 25;

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

    index: async (req, res) => {
        if (!req.user) {
            res.redirect('/login');
            return;
        }
        try {
            const data = await Categories.getAll();
            res.render('client/home', {
                title: 'Home',
                type: data
            });
        }
        catch (err) {
            console.log('Get type err: ', err);
        }
    },

    show: async (req, res, next) => {
        try {
            const product = await Product.getProduct(req.params.slug);
            console.log(req.user);
            let user;
            if (req.user.displayName !== undefined) {
                user = await Account.getUser(req.user.id);
            } else {
                user = req.user;
            }
            if (product == null) {
                return next();
            }
            res.render('product', {
                product: product,
                user: user,
                name: user.HoTen
            });
        }
        catch (err) {
            console.log('err type: ', err);
        }
    },

    //Product Management

    updateProduct: async (req, res) => {
        // try {
        //     const id = req.query.id;
        //     const newval = req.query.newval;
        //     if (await Categories.update(["MaLoai", "TenLoai"], [id, newval], id))
        //         res.json(true);
        //     else
        //         res.json(false);
        // }
        // catch (error) {
        //     console.log("updateCategories error: ", error);
        //     res.json(false);
        // }
    },

    deleteProduct: async (req, res) => {
        // try {
        //     const id = req.query.id;
        //     if (await Categories.delete(id))
        //         res.json(true);
        //     else
        //         res.json(false);
        // }
        // catch (error) {
        //     console.log("deleteCategories error: ", error);
        //     res.json(false);
        // }
    },

    addProduct: async (req, res) => {
        // const name = req.query.name;
        // const result = await Categories.insert(new Categories(name));
        // if (result !== null)
        //     res.json(result);
    }
}