const Account = require('../models/account.m');

module.exports = {
    GetAllAccount: async (req, res) => {
        try {
            const data = await Account.getAll();
            res.render('accountManager_test', {
                data: data,
            })
        }
        catch (error) {
            console.log("GetAllAccount error: ", error);
        }
    },
    EditAccount: async (req, res) => {
        try {
            const Username = req.body.Username;
            let data = await Account.getUserByUsername(Username);
            const dateObject = new Date(data.NgaySinh);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
            const day = String(dateObject.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            data.NgaySinh = formattedDate;
            res.render('editAccount_test', {
                data: data,
            })
        }
        catch (error) {
            console.log("EditAccount error: ", error);
        }
    },
    Save: async (req, res) => {
        try {
            const Id = req.body.id;
            const Fullname = req.body.fullname;
            const Phone = req.body.phone;
            const Birth = req.body.birth;
            const Email = req.body.email;
            const Gender = req.body.gender;
            const Username = req.body.username;
            await Account.update(
                ["HoTen", "SDT", "NgaySinh", "Email", "GioiTinh", "UserName"],
                [Fullname, Phone, Birth, Email, Gender, Username],
                Id
            );
            res.redirect('/accountTest');
        }
        catch (error) {
            console.log("Save error: ", error);
        }
    }
}