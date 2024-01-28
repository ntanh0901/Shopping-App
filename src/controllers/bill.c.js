const Bill = require('../models/bill.m');
const BillDetail = require('../models/billdetail.m');

module.exports = {
    bestselling: async (req, res) => {
        try {
            const data = await BillDetail.calcTotal(10, "SoLuong"); // 10 sp có số lượng bán nhiều nhất
            console.log(data);
            // res.json(data);
            res.send('test');
        }
        catch (err) {
            console.log("categoriesstatistics error: ", err);
            res.json(false);
        }
    },

    categoriesStatistics: async (req, res) => {
        // if (!req.user || req.user.LaAdmin !== '1') res.redirect('/');
        try {
            const data = await BillDetail.categoriesStatistics("TongTien"); // Loại sp theo TongTien
            console.log(data);
            // res.json(data);
            res.send('test');
        }
        catch (err) {
            console.log("categoriesstatistics error: ", err);
            res.json(false);
        }
    }
}