const db = require('../utils/db');
const tbName = "Loai";

module.exports = class Categories {
    constructor(MaLoai, TenLoai) {
        this.MaLoai = MaLoai;
        this.TenLoai = TenLoai;
    }
    static async insert(category) {
        return db.insertWithoutID(tbName, category);
    }
    static async getProduct(id) {
        return db.select(tbName, "MaLoai", id);
    }
    static async getAll() {
        return db.selectAll(tbName);
    }
    static async update(col, colval, id) {
        return db.update(tbName, col, colval, "MaLoai", id);
    }
    static async delete(id) {
        return db.delete(tbName, "MaLoai", id);
    }
}