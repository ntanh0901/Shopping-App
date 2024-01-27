const Account = require('../models/account.m');

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
            const orderBy = req.query.orderBy || "MaND";
            const isDesc = req.query.isDesc || false;
            const searchInput = req.query.search || null;
            const searchCol = req.query.searchCol || "HoTen";
            let data = null;
            if (searchInput === null) {
                data = await Account.getAllBy(orderBy, isDesc);
                // console.log(data);
            } else {
                data = await Account.getSearch(searchInput, searchCol);
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
            console.log('getAccounts page error: ', error);
        }
    },
    updateAccount: async (req, res) => {
        try {
            const id = req.body.id;
            const newval = req.body.newval;
            if (await Account.update(
                ["MaND", "HoTen", "SDT", "NgaySinh", "Email", "Anh", "GioiTinh", "Username", "MatKhau", "LaKhachHang", "LaAdmin", "DiaChi"],
                [id, newval.HoTen, newval.SDT, newval.NgaySinh, newval.Email, newval.Anh, newval.GioiTinh, newval.Username, newval.MatKhau, newval.LaKhachHang, newval.LaAdmin, newval.DiaChi],
                id))
                res.json(true);
            else
                res.json(false);
        }
        catch (error) {
            console.log("updateAccount error: ", error);
            res.json(false);
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const id = req.body.id;
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
        const newval = req.body.acc;
        const result = await Product.insert(new Account(
            newval.HoTen, newval.SDT, newval.NgaySinh, 
            newval.Email, newval.Anh, newval.GioiTinh, 
            newval.Username, newval.MatKhau, 
            newval.LaKhachHang, newval.LaAdmin, newval.DiaChi));
        res.json(result);
    }
}