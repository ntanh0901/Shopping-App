const db = require('../utils/db');
const tbName = "NguoiDung";

module.exports = class User {
    constructor(HoTen, SDT, NgaySinh, GioiTinh, Username, MatKhau, Email, Anh, LaKhachHang, LaAdmin, DiaChi) {
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
        return db.insertWithoutID(tbName, user);
    }
    static async getUserByUsername(username) {
        return db.select(tbName, "UserName", username);
    }
    static async getUserByID(id) {
        return db.select(tbName, "MaND", id);
    }
    static async getUserByUsername(username, cb) {
        const res = db.select(tbName, "UserName", username);
        cb(res);
        return res;
    }
}