const db = require('../utils/db');
const tbName = "HoaDon";

module.exports = class Bill {
    constructor(NgayLap, PhuongThucTT, TongHoaDon, KHMua) {
        this.NgayLap = NgayLap;
        this.PhuongThucTT = PhuongThucTT;
        this.TongHoaDon = TongHoaDon;
        this.KHMua = KHMua;
    }
    static async insert(bill) {
        return db.insertWithoutID(tbName, bill);
    }
    static async getAll() {
        return db.selectAll(tbName);
    }
    static async getAllBy(orderBy, isDesc) {
        return db.selectAllBy(tbName, orderBy, isDesc);
    }
}