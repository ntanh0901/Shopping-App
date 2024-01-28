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
            if (existed) {
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
    }
}