const db = require('../utils/db');
const tbName = "ChiTietHoaDon";

module.exports = class BillDetail {
    constructor(MaHD, MaSP, SoLuong, TongTien) {
        this.MaHD = MaHD;
        this.MaSP = MaSP;
        this.SoLuong = SoLuong;
        this.TongTien = TongTien;
    }
    static async insert(billdetail) {
        return db.insertWithoutID(tbName, billdetail);
    }
    static async getAll() {
        return db.selectAll(tbName);
    }
    static async getAllBy(orderBy, isDesc) {
        return db.selectAllBy(tbName, orderBy, isDesc);
    }
    static async calcTotal(limit, orderBy) {
        return db.calculateTotals(["MaSP"], ["SoLuong", "TongTien"], tbName, limit, orderBy);
    }
    static async categoriesStatistics(orderBy) {
        return db.joinAndCalculateTotals("ChiTietHoaDon", "SanPham", "MaSP", "MaSP",["MaLoai"], ["SoLuong", "TongTien"], null, orderBy);
    }
}