const Bill = require('../models/bill.m');
const BillDetail = require('../models/billdetail.m');

module.exports = {
    bestselling: async (req, res) => {
        try {
            const top = parseInt(req.query.top) || 5;
            const data = await BillDetail.calcTotal(top, "SoLuong");
            res.json(data);
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
            res.json(data);
        }
        catch (err) {
            console.log("categoriesstatistics error: ", err);
            res.json(false);
        }
    }
}