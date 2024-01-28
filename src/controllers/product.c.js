const Product = require('../models/product.m');
const Account = require('../models/account.m');
const Categories = require('../models/categories.m');
const fs = require('fs').promises;
const path = require('path');

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
            const searchInput = req.query.search || null;
            let data = null;
            if (searchInput === null) {
                if (type === 'Tất cả') {
                    data = await Product.getAllProductsWithType(orderBy, isDesc);
                } else {
                    data = await Product.getBy(type, orderBy, isDesc);
                }
                // console.log(data);
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
            const totalPages = Math.ceil(total / itemsPerPage);

            res.json({
                data: data,
                perpage: itemsPerPage,
                total: total,
                type: type,
                totalPages: totalPages
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

    //Product Management

    updateProduct: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        try {
            const id = req.body.id;
            const newval = req.body.newval;
            if (await Product.update(
                ["MaSP", "Ten", "DonGia", "SoLuongTon", "Anh", "MaLoai"],
                [id, newval.Ten, newval.DonGia, newval.SoLuongTon, newval.Anh, newval.MaLoai],
                id))
                res.json(true);
            else
                res.json(false);
        }
        catch (error) {
            console.log("updateCategories error: ", error);
            res.json(false);
        }
    },

    deleteProduct: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        try {
            const id = req.body.id;
            const deleteImgPath = req.body.imgs;
            const baseDirectory = path.join(__dirname, '../../public');
            for (let i = 0; i < deleteImgPath.length; i++) {
                if (deleteImgPath[i] !== "/img/logo_hcmus.png") {
                    const absolutePath = path.join(baseDirectory, deleteImgPath[i]);
                    // console.log(absolutePath);
                    try {
                        await fs.unlink(absolutePath);
                    }
                    catch (err) {
                        console.log("delete image failed: ", err);
                    }
                }
            }
            if (await Product.delete(id))
                res.json(true);
            else
                res.json(false);
        }
        catch (error) {
            console.log("deleteProduct error: ", error);
            res.json(false);
        }
    },

    addProduct: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        const name = req.body.name;
        const price = req.body.price;
        const stock = req.body.stock;
        const images = req.body.images;
        const type = req.body.type;
        const result = await Product.insert(new Product(name, price, stock, images, type));
        res.json(result);
    }
}