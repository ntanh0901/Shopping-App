const db = require('../utils/dbPayment');
const tbName = "ThanhToan";

module.exports = class TaiKhoan {
    constructor(ID, SoDu) {
        this.ID = ID;
        this.SoDu = SoDu;
    }
    static async insert(account) {
        return db.insertWithoutID(tbName, account);
    }
    static async getAccountByID(id) {
        return db.select(tbName, "ID", id);
    }
    static async getMainAccount() {
        return db.setlect(tbName, "ID", '-1');
    }
    static async updateBalance(id, newBalance) {
        return db.updateBalance(id, newBalance);
    }
    static async checkRefreshToken(token) {
        return db.select("RefreshToken", "Token", token);
    }
    static async insertRefreshToken(token) {
        return db.insertWithoutID("RefreshToken", { Token: token });
    }
    static async deleteRefreshToken(token) {
        return db.delete("RefreshToken", "Token", token);
    }
}