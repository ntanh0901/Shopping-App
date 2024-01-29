const Account = require('../models/account.m');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const saltBounds = 10;

module.exports = {
    // GetAllAccount: async (req, res) => {
    //     try {
    //         const data = await Account.getAll();
    //         res.render('accountManager_test', {
    //             data: data,
    //         })
    //     }
    //     catch (error) {
    //         console.log("GetAllAccount error: ", error);
    //     }
    // },
    // EditAccount: async (req, res) => {
    //     try {
    //         const Username = req.body.Username;
    //         let data = await Account.getUserByUsername(Username);
    //         const dateObject = new Date(data.NgaySinh);
    //         const year = dateObject.getFullYear();
    //         const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    //         const day = String(dateObject.getDate()).padStart(2, '0');
    //         const formattedDate = `${year}-${month}-${day}`;
    //         data.NgaySinh = formattedDate;
    //         res.render('editAccount_test', {
    //             data: data,
    //         })
    //     }
    //     catch (error) {
    //         console.log("EditAccount error: ", error);
    //     }
    // },
    // Save: async (req, res) => {
    //     try {
    //         const Id = req.body.id;
    //         const Fullname = req.body.fullname;
    //         const Phone = req.body.phone;
    //         const Birth = req.body.birth;
    //         const Email = req.body.email;
    //         const Gender = req.body.gender;
    //         const Username = req.body.username;
    //         await Account.update(
    //             ["HoTen", "SDT", "NgaySinh", "Email", "GioiTinh", "UserName"],
    //             [Fullname, Phone, Birth, Email, Gender, Username],
    //             Id
    //         );
    //         res.redirect('/accountTest');
    //     }
    //     catch (error) {
    //         console.log("Save error: ", error);
    //     }
    // }
    getAccounts: async (req, res, next) => {
        try {
            const orderBy = req.body.orderBy || "MaND";
            const isDesc = req.body.isDesc || false;
            const searchInput = req.body.searchinput || null;
            const searchCol = req.body.searchCol || "HoTen";
            let data = null;
            if (searchInput === null) {
                data = await Account.getAllBy(orderBy, isDesc);
                // console.log(data);
            } else {
                data = await Account.getSearch(searchInput, searchCol, orderBy);
            }
            for (let i = 0; i < data.length; i++) {
                delete data[i].MatKhau;
                const dateObject = new Date(data[i].NgaySinh);
                const year = dateObject.getFullYear();
                const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                const day = String(dateObject.getDate()).padStart(2, '0');
                const formattedDate = `${year}-${month}-${day}`;
                data[i].NgaySinh = formattedDate;
            }

            const total = data.length;

            const currentPage = req.body.page || 1;
            const itemsPerPage = 2;

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            data = data.slice(startIndex, endIndex);
            const totalPages = Math.ceil(total / itemsPerPage);

            res.json({
                data: data,
                perpage: itemsPerPage,
                total: total,
                totalPages: totalPages
            });
        } catch (error) {
            console.log('getAccounts page error: ', error);
        }
    },
    updateAccount: async (req, res) => {
        try {
            const id = req.body.id;
            const newval = req.body.newval;
            const existed = await Account.getUserByUsername(newval.UserName);
            if (existed && existed.MaND !== parseInt(id)) {
                console.log('existed account');
                res.json(false);
                return;
            }
            if (await Account.update(
                ["MaND", "HoTen", "SDT", "NgaySinh", "Email", "Anh", "GioiTinh", "UserName", "LaKhachHang", "LaAdmin", "DiaChi"],
                [id, newval.HoTen, newval.SDT, newval.NgaySinh, newval.Email, newval.Anh, newval.GioiTinh, newval.UserName, newval.LaKhachHang, newval.LaAdmin, newval.DiaChi],
                id))
                res.json(true);
            else
                res.json(true);
        }
        catch (error) {
            console.log("updateAccount error: ", error);
            res.json(false);
        }
    },

    deleteAccount: async (req, res) => {
        if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        try {
            const id = req.body.id;
            const deleteImgPath = req.body.imgs;
            try {
                if (deleteImgPath !== "/img/logo_hcmus.png") {
                    const baseDirectory = path.join(__dirname, '../../public');
                    const absolutePath = path.join(baseDirectory, deleteImgPath);
                    await fs.unlink(absolutePath);
                }
            }
            catch (err) {
                console.log("deleteProduct-deleteAvt error", err);
            }
            if (await Account.delete(id))
                res.json(true);
            else
                res.json(false);
        }
        catch (error) {
            console.log("deleteProduct error: ", error);
            res.json(false);
        }
    },

    addAccount: async (req, res) => {
        try {
            const newval = req.body.acc;
            const isAdmin = (newval.role === "Admin") ? '1' : '0';
            const isCustomer = (newval.role === "Khách hàng") ? '1' : '0';
            const HashPW = await bcrypt.hash(newval.MatKhau, saltBounds);
            const result = await Account.insert(new Account(
                newval.HoTen, newval.SDT, newval.NgaySinh,
                newval.Email, newval.Anh, newval.GioiTinh,
                newval.UserName, HashPW,
                isCustomer, isAdmin, newval.DiaChi));
            res.json(result);
        } catch (error) {
            res.join(false);
        }
    },

    getAccessToken: async (req, res, next) => {
        if (req.session.accessToken) {
            next();
            return;
        }
        try {
            const response = await fetch("http://localhost:3001/getAccessToken", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Id: req.user.MaND }),
            });

            const data = await response.json();

            req.session.accessToken = data.accessToken;
            req.session.refreshToken = data.refreshToken;

        } catch (error) {
            console.log('Get access token error: ' + error);
        }
        next();
    },

    getNewAccessToken: async (req, res, next) => {
        try {
            const response = await fetch("http://localhost:3001/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: req.session.refreshToken }),
            });

            const data = await response.json();

            req.session.accessToken = data.accessToken;

        } catch (error) {
            console.log('Refresh token error: ' + error);
        }
        await module.exports.getBalance(req, res, next);
    },

    getBalance: async (req, res, next) => {
        try {
            const response = await fetch("http://localhost:3001/getBalance", {
                method: 'GET',
                headers: {
                    'authorization': 'Bearer ' + req.session.accessToken
                }
            });
            const data = await response.json();

            req.session.balance = data.balance;

            next();

        } catch (error) {
            await module.exports.getNewAccessToken(req, res, next);
            //console.log('Get balance error: ' + error);
        }
    },

    rechargeMoney: function (req, res, next) {
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const dateFormat = require('dateformat');


        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURNURL;

        const date = new Date();

        const createDate = dateFormat(date, 'yyyymmddHHmmss');
        const orderId = dateFormat(date, 'HHmmss');

        const amount = req.body.moneyValue;
        const bankCode = 'NCB';

        const orderInfo = 'NT' + req.user.MaND;
        const orderType = 'other';
        const locale = 'vn';
        const currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);


        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const crypto = require("crypto");
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log(vnpUrl);
        res.redirect(vnpUrl);
    },

    revokeToken: async (req, res, next) => {
        try {
            const response = await fetch("http://localhost:3001/logout", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: req.session.refreshToken }),
            });

            const data = await response;

        } catch (error) {
            console.log('Revoke access token error: ' + error);
        }
        next();
    }, 

    checkoutSuccess: async (req, res, next) => {
        console.log(req.body);
        console.log('Stay still');
        const dateFormat = require('dateformat');
        const date = new Date();
        const maHD = dateFormat(date, 'HHmmss');
        let rawTotalPrice = req.body.rawTotalPrice.replace(/\./g, '');
        const amount = rawTotalPrice / 1000;
        const customer = req.user.MaND;
        const hoaDon = {
            MaHD: maHD,
            NgayLap: date,
            TongHoaDon: amount,
            KHMua: customer
        };
        await Account.insertHoaDon(hoaDon);
        const data =  req.session.cart;
        for (let i = 0; i < data.length; i++) {
            let chiTietHoaDon = { MaHD: maHD };
            if (data[i].checked) {
                chiTietHoaDon.MaSP = data[i].id;
                chiTietHoaDon.SoLuong = data[i].amount;
                chiTietHoaDon.TongTien = data[i].product.TongGia || data[i].product.DonGia;
                await Account.insertChiTietHoaDon(chiTietHoaDon);
            }
        }

        try {
            const response = await fetch("http://localhost:3001/transferMoney", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: customer, amount: amount * 1000 }),
            });

            const data = await response;

        } catch (error) {
            console.log('Transfer money error: ' + error);
        }

        req.session.cart = [];
        res.redirect('/client');
        
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}