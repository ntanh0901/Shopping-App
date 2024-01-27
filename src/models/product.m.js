const db = require('../utils/db');
const tbName = "SanPham";

module.exports = class Product {
    constructor(Ten, DonGia, SoLuongTon, Anh, MaLoai) {
        this.Ten = Ten;
        this.DonGia = DonGia;
        this.SoLuongTon = SoLuongTon;
        this.Anh = Anh;
        this.MaLoai = MaLoai;
    }
    static async insert(product) {
        return db.insertWithoutID(tbName, product);
    }
    static async getProduct(id) {
        return db.select(tbName, "MaSP", id);
    }
    static async getAll() {
        return db.selectAll(tbName);
    }
    static async getAllBy(orderBy, isDesc) {
        return db.selectAllBy(tbName, orderBy, isDesc);
    }
    static async getBy(type) {
        return db.joinTB(tbName, "Loai", "MaLoai", "TenLoai", type);
    }
    static async getBy(type, orderBy, isDesc) {
        return db.joinTB(tbName, "Loai", "MaLoai", "MaLoai", "TenLoai", type, orderBy, isDesc, null);
    }
    static async getAllProductsWithType(orderBy, isDesc) {
        return db.joinTBnGetAll(tbName, "Loai", "MaLoai", "MaLoai", orderBy, isDesc, null);
    }
    static async delete(id) {
        return db.delete(tbName, "MaSP", id);
    }
    static async update(col, colval, id) {
        return db.update(tbName, col, colval, "MaSP", id);
    }
}