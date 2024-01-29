const db = require('../utils/db');
const tbName = "NguoiDung";

module.exports = class User {
    constructor(HoTen, SDT, NgaySinh, Email, Anh, GioiTinh, Username, MatKhau, LaKhachHang, LaAdmin, DiaChi) {
        this.HoTen = HoTen;
        this.SDT = SDT;
        this.NgaySinh = NgaySinh;
        this.Email = Email;
        this.Anh = Anh;
        this.GioiTinh = GioiTinh;
        this.UserName = Username;
        this.MatKhau = MatKhau;
        this.LaKhachHang = LaKhachHang;
        this.LaAdmin = LaAdmin;
        this.DiaChi = DiaChi;
    }
    static async insert(user) {
        return await db.insertWithoutID(tbName, user);
    }
    static async getUserByUsername(username) {
        return await db.select(tbName, "UserName", username);
    }
    static async getUserByID(id) {
        return await db.select(tbName, "MaND", id);
    }
    static async getUserByUsername2(username, cb) {
        const res = await db.select(tbName, "UserName", username);
        cb(res);
        return res;
    }
    static async getAll() {
        return await db.selectAll(tbName);
    }
    static async update(col, colval, id) {
        return db.update(tbName, col, colval, "MaND", id);
    }
    static async insertHoaDon(hoaDon) {
        return await db.insertWithoutID("HoaDon", hoaDon);
    }
    static async insertChiTietHoaDon(chiTietHoaDon) {
        return await db.insertWithoutID("ChiTietHoaDon", chiTietHoaDon);
    }
    static async getAllHoaDon(id) {
        return await db.selectMany("HoaDon", "KHMua", id);
    }
    static async getAllChiTietHoaDon(maHD) {
        return await db.selectMany("ChiTietHoaDon", "MaHD", maHD);
    }
}