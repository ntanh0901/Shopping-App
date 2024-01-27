require('dotenv').config();
const pgp = require('pg-promise')();

let cn = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DEFAULT_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    max: 30
};
let db;
db = pgp(cn);

main();

async function main() {
    if (!await checkDatabaseExists(process.env.DB_DB)) {
        await createDB(process.env.DB_DB);
        await create();
    }
    else {
        cn.database = process.env.DB_DB;
        db = pgp(cn);
    }
}

// Create DB functions
async function checkDatabaseExists(databaseName) {
    try {
        const result = await db.any(
            'SELECT datname FROM pg_database WHERE datname = $1',
            [databaseName]
        );
        return result.length > 0;
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function createDB(dbName) {
    let res = true;
    try {
        const isExists = await checkDatabaseExists(dbName);
        if (isExists) {
            res = false;
            console.log(`Database ${dbName} existed`);
        } else {
            await (async () => {
                try {
                    await db.none(`CREATE DATABASE ${dbName}`);
                    console.log(`Database ${dbName} created`);
                } catch (error) {
                    console.log('create DataBase error: ', error);
                }
            })();
        }
        cn.database = dbName;
        db = pgp(cn);
        return res;
    } catch (error) {
        console.log('createDB error: ', error);
    }
}
async function createTB(tbName, cols) {
    try {
        let colDefinitions = cols.map(cols => {
            return `"${cols.name}" ${cols.type} ${cols.constraints || ''}`;
        }).join(', ');

        const primaryKeys = cols.filter(col => col.primaryKey).map(col => col.name);
        if (primaryKeys.length > 0) {
            colDefinitions += `, CONSTRAINT PK_${tbName} PRIMARY KEY ("${primaryKeys.join('", "')}")`;
        }

        await db.none(`
            CREATE TABLE IF NOT EXISTS "${tbName}" (${colDefinitions});
        `);

        console.log(`Table ${tbName} created`);
    } catch (error) {
        console.log('Create table error: ', error);
    }
}
async function addForeignKey(tbName, foreignKeyName, cols, refTable, refCols) {
    try {
        const colNames = cols.map(col => `"${col}"`).join(', ');
        const refColNames = refCols.map(refCol => `"${refCol}"`).join(', ');

        await db.none(`
            ALTER TABLE "${tbName}"
            ADD CONSTRAINT "${foreignKeyName}"
            FOREIGN KEY (${colNames})
            REFERENCES "${refTable}"(${refColNames})
        `);
        console.log(`Foreign key ${foreignKeyName}`);
    } catch (error) {
        console.log('Foreign key error: ', error);
    }
}
async function create() {
    // Nguoi Dung
    try {
        const cols = [
            { name: 'MaND', type: 'SERIAL', primaryKey: true },
            { name: 'HoTen', type: 'varchar(35) NOT NULL' },
            { name: 'SDT', type: 'char(12)' },
            { name: 'NgaySinh', type: 'DATE' },
            { name: 'Email', type: 'text' },
            { name: 'Anh', type: 'text[]' },
            { name: 'GioiTinh', type: 'text' },
            { name: 'UserName', type: 'text UNIQUE' },
            { name: 'MatKhau', type: 'text' },
            { name: 'LaKhachHang', type: ' BIT NOT NULL' },
            { name: 'LaAdmin', type: 'BIT NOT NULL' },
            { name: 'DiaChi', type: 'varchar(50)' }
        ];
        await createTB("NguoiDung", cols);
    } catch (error) {
        console.log(`Create table NguoiDung error: `, error);
    }
    // Hoa Don
    try {
        const cols = [
            { name: 'MaHD', type: 'SERIAL', primaryKey: true },
            { name: 'NgayLap', type: 'TIMESTAMP WITHOUT TIME ZONE' },
            { name: 'TongHoaDon', type: 'FLOAT8' },
            { name: 'KHMua', type: 'INT NOT NULL' },
        ];
        await createTB("HoaDon", cols);
    } catch (error) {
        console.log(`Create table HoaDon error: `, error);
    }
    // San Pham
    try {
        const cols = [
            { name: 'MaSP', type: 'SERIAL', primaryKey: true },
            { name: 'Ten', type: 'TEXT NOT NULL UNIQUE' },
            { name: 'DonGia', type: 'FLOAT8 NOT NULL' },
            { name: 'SoLuongTon', type: 'INT NOT NULL' },
            { name: 'Anh', type: 'text[]' },
            { name: 'MaLoai', type: 'INT NOT NULL' }
        ];
        await createTB("SanPham", cols);
    } catch (error) {
        console.log(`Create table SanPham error: `, error);
    }
    // Loai
    try {
        const cols = [
            { name: 'MaLoai', type: 'SERIAL', primaryKey: true },
            { name: 'TenLoai', type: 'TEXT NOT NULL' }
        ];
        await createTB("Loai", cols);
    } catch (error) {
        console.log(`Create table Loai error: `, error);
    }
    // Chi Tiet Hoa Don
    try {
        const cols = [
            { name: 'MaHD', type: 'INT', primaryKey: true },
            { name: 'MaSP', type: 'INT', primaryKey: true },
            { name: 'SoLuong', type: 'INT NOT NULL' },
            { name: 'TongTien', type: 'FLOAT8 NOT NULL' }
        ];
        await createTB("ChiTietHoaDon", cols);
    } catch (error) {
        console.log(`Create table ChiTietHoaDon error: `, error);
    }
    // Doanh thu
    try {
        const cols = [
            { name: 'MDTD', type: 'SERIAL', primaryKey: true },
            { name: 'Ngay', type: 'DATE' },
            { name: 'TongDT', type: 'FLOAT8 NOT NULL' }
        ];
        await createTB("DoanhThu", cols);
    } catch (error) {
        console.log(`Create table DoanhThu error: `, error);
    }
    // // Nhap Hang
    // try {
    //     const cols = [
    //         {name: 'MaNH', type: 'SERIAL', primaryKey: true},
    //         {name: 'NgayLap', type: 'DATE'}
    //     ];
    //     await createTB("NhapHang", cols);
    // } catch (error) {
    //     console.log(`Create table NhapHang error: `, error);
    // }
    // // Chi Tiet Nhap Hang
    // try {
    //     const cols = [
    //         {name: 'MaNH', type: 'INT', primaryKey: true},
    //         {name: 'MaSP', type: 'INT', primaryKey: true},
    //         {name: 'SoLuong', type: 'INT NOT NULL'}
    //     ];
    //     await createTB("ChiTietNhapHang", cols);
    // } catch (error) {
    //     console.log(`Create table ChiTietNhapHang error: `, error);
    // }
    await addForeignKey("HoaDon", "FK_KHMua_MaND", ["KHMua"], "NguoiDung", ["MaND"]);
    await addForeignKey("ChiTietHoaDon", "FK_MaHD_MaHD", ["MaHD"], "HoaDon", ["MaHD"]);
    await addForeignKey("ChiTietHoaDon", "FK_MaSP_MaSP", ["MaSP"], "SanPham", ["MaSP"]);
    await addForeignKey("SanPham", "FK_MaLoai_MaLoai", ["MaLoai"], "Loai", ["MaLoai"]);

    await insertData();
}
async function insertData() {
    // Product
    await insertWithoutID("Loai", {TenLoai: "Đồng hồ"});
    await insertWithoutID("Loai", {TenLoai: "Bách hóa"});
    await insertWithoutID("Loai", {TenLoai: "Thể thao"});
    await insertWithoutID("Loai", {TenLoai: "Nhà cửa và đời sống "});
    await insertWithoutID("Loai", {TenLoai: "Phụ kiện thời trang"});

    const link = "/img/products/";
    const ext = ".jpg";
    await insertWithoutID("SanPham", {Ten: "Đồng hồ nam dây da Skmei 90TCK58", DonGia: "500", SoLuongTon: "100", Anh: [link + "Đồng hồ nam dây da Skmei 90TCK58" + ext], MaLoai: "1"})
    await insertWithoutID("SanPham", {Ten: "Đồng hồ Nam thể thao SKMEI 1155B", DonGia: "340", SoLuongTon: "100", Anh: [link + "Đồng hồ Nam thể thao SKMEI 1155B" + ext], MaLoai: "1"})
    await insertWithoutID("SanPham", {Ten: "Đồng hồ Nữ Daniel Klein", DonGia: "720", SoLuongTon: "100", Anh: [link + "Đồng hồ Nữ Daniel Klein" + ext], MaLoai: "1"})
    await insertWithoutID("SanPham", {Ten: "Đồng Hồ Nữ JA-1017 Julius", DonGia: "475", SoLuongTon: "100", Anh: [link + "Đồng Hồ Nữ JA-1017 Julius" + ext], MaLoai: "1"})
    await insertWithoutID("SanPham", {Ten: "Đồng Hồ Nữ JS-060 Julius", DonGia: "263", SoLuongTon: "100", Anh: [link + "Đồng Hồ Nữ JS-060 Julius" + ext], MaLoai: "1"})
    await insertWithoutID("SanPham", {Ten: "Dầu Đậu Nành Simply", DonGia: "76.7", SoLuongTon: "100", Anh: [link + "Dầu Đậu Nành Simply" + ext], MaLoai: "2"})
    await insertWithoutID("SanPham", {Ten: "Hộp quà Tết OREO 463.2g", DonGia: "50", SoLuongTon: "100", Anh: [link + "Hộp quà Tết OREO 463.2g" + ext], MaLoai: "2"})
    await insertWithoutID("SanPham", {Ten: "Bình Giữ Nhiệt Lock&Lock", DonGia: "329", SoLuongTon: "100", Anh: [link + "Bình Giữ Nhiệt Lock&Lock" + ext], MaLoai: "2"})
    await insertWithoutID("SanPham", {Ten: "Cà phê G7 3in1", DonGia: "129", SoLuongTon: "100", Anh: [link + "Cà phê G7 3in1" + ext], MaLoai: "2"})
    await insertWithoutID("SanPham", {Ten: "Bánh ăn sáng C'est bon", DonGia: "129", SoLuongTon: "100", Anh: [link + "Bánh ăn sáng C'est bon" + ext], MaLoai: "2"})
    await insertWithoutID("SanPham", {Ten: "Dụng cụ tập cơ tay điều chỉnh lực", DonGia: "39", SoLuongTon: "100", Anh: [link + "Dụng cụ tập cơ tay điều chỉnh lực" + ext], MaLoai: "3"})
    await insertWithoutID("SanPham", {Ten: "Kính bơi HMK", DonGia: "109", SoLuongTon: "100", Anh: [link + "Kính bơi HMK" + ext], MaLoai: "3"})
    await insertWithoutID("SanPham", {Ten: "Xà Đơn  Treo Tường", DonGia: "298", SoLuongTon: "100", Anh: [link + "Xà Đơn  Treo Tường" + ext], MaLoai: "3"})
    await insertWithoutID("SanPham", {Ten: "Thảm Tập Yoga TPE", DonGia: "119", SoLuongTon: "100", Anh: [link + "Thảm Tập Yoga TPE" + ext], MaLoai: "3"})
    await insertWithoutID("SanPham", {Ten: "Bảng Phóng Phi Tiêu", DonGia: "59", SoLuongTon: "100", Anh: [link + "Bảng Phóng Phi Tiêu" + ext], MaLoai: "3"})
    await insertWithoutID("SanPham", {Ten: "Cây lăn bụi", DonGia: "27.5", SoLuongTon: "100", Anh: [link + "Cây lăn bụi" + ext], MaLoai: "4"})
    await insertWithoutID("SanPham", {Ten: "Vợt Muỗi Sunhouse", DonGia: "72", SoLuongTon: "100", Anh: [link + "Vợt Muỗi Sunhouse" + ext], MaLoai: "4"})
    await insertWithoutID("SanPham", {Ten: "Ủng Bọc Giày", DonGia: "39.9", SoLuongTon: "100", Anh: [link + "Ủng Bọc Giày" + ext], MaLoai: "4"})
    await insertWithoutID("SanPham", {Ten: "Combo 10 Móc Dán Tường", DonGia: "25", SoLuongTon: "100", Anh: [link + "Combo 10 Móc Dán Tường" + ext], MaLoai: "4"})
    await insertWithoutID("SanPham", {Ten: "Thảm nhà tắm", DonGia: "120", SoLuongTon: "100", Anh: [link + "Thảm nhà tắm" + ext], MaLoai: "4"})
    await insertWithoutID("SanPham", {Ten: "Gọng kính SARIFA", DonGia: "130", SoLuongTon: "100", Anh: [link + "Gọng kính SARIFA" + ext], MaLoai: "5"})
    await insertWithoutID("SanPham", {Ten: "Thắt lưng dây nịt nam da bò", DonGia: "126", SoLuongTon: "100", Anh: [link + "Thắt lưng dây nịt nam da bò" + ext], MaLoai: "5"})
    await insertWithoutID("SanPham", {Ten: "Tất vớ nam", DonGia: "45", SoLuongTon: "100", Anh: [link + "Tất vớ nam" + ext], MaLoai: "5"})
    await insertWithoutID("SanPham", {Ten: "Mắt Kính Râm Mát Nam", DonGia: "139", SoLuongTon: "100", Anh: [link + "Mắt Kính Râm Mát Nam" + ext], MaLoai: "5"})
    await insertWithoutID("SanPham", {Ten: "Mũ lưỡi trai Ulzzang", DonGia: "55", SoLuongTon: "100", Anh: [link + "Mũ lưỡi trai Ulzzang" + ext], MaLoai: "5"})

    await insertWithoutID("NguoiDung", {HoTen: "Admin", SDT: "0123456789", NgaySinh: "2024-01-27", Email: "admin@gmail.com", Anh: null, GioiTinh: "Nam", UserName: "admin", MatKhau: "$2b$10$QtR0ofZC1BDmuiuzYkqNfuajeXLHgTt8h8XHLDNKon3wq9dYwqW82", LaKhachHang: "0", LaAdmin: "1", DiaChi: null});
    await insertWithoutID("NguoiDung", {HoTen: "Khach Hang", SDT: "0123456789", NgaySinh: "2024-01-27", Email: "khach@gmail.com", Anh: null, GioiTinh: "Nam", UserName: "khach", MatKhau: "$2b$10$QtR0ofZC1BDmuiuzYkqNfuajeXLHgTt8h8XHLDNKon3wq9dYwqW82", LaKhachHang: "1", LaAdmin: "0", DiaChi: null});
}
async function insertWithoutID(tbName, entity) {
    try {
        const query = {
            text: `INSERT INTO "${tbName}" ("${Object.keys(entity).join('", "')}") VALUES(${Object.keys(entity).map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
            values: Object.values(entity),
        };
        const result = await db.oneOrNone(query);
        if (result) {
            console.log(`1 row inserted to ${tbName}.`);
            return result;
        } else {
            console.log('No data returned from the query.');
            return null;
        }
    } catch (error) {
        console.log('Insert error: ', error);
    }
    return null;
}
module.exports = {
    insertWithoutID,
    insert: async (tbName, entity) => {
        try {
            const query = pgp.helpers.insert(entity, null, tbName);
            const result = await db.one(query + ' returning *');
            if (result) {
                console.log(`1 row inserted to ${tbName}.`);
                return result;
            } else {
                console.log('No data returned from the query.');
                return null;
            }
        } catch (error) {
            console.log('Insert error: ', error);
        }
    },

    delete: async (tbName, col, val) => {
        try {
            const result = await db.result(
                `DELETE FROM "${tbName}" WHERE "${col}" = $1 RETURNING *`, [val]
            );
            if (result.rowCount > 0) {
                console.log(`Deleted row with value ${val} in colmn ${col}`);
                return true;
            }
            else {
                console.log(`No rows deleted. Row not found`);
            }
        } catch (error) {
            console.log('Delete error: ', error);
            return false;
        }
        return false;
    },

    selectAll: async (tbName) => {
        try {
            const data = await db.any(`SELECT * FROM "${tbName}"`);
            return data;
        }
        catch (error) {
            console.log('Select all error: ', error);
        }
    },

    selectAllBy: async (tbName, colOrder, isDesc) => {
        try {
            let query = `
            SELECT * FROM "${tbName}"
            `;
            if (colOrder) {
                if (isDesc) {
                    query += `ORDER BY "${colOrder}" DESC `;
                }
                else query += `ORDER BY "${colOrder}" ASC `;
            }
            const data = await db.any(query);
            return data;
        }
        catch (error) {
            console.log('Select all error: ', error);
        }
    },

    selectTopByCol: async (tbName, col, limit, isDesc) => {
        try {
            let query = `
            SELECT * 
            FROM "${tbName}"
            WHERE ${col} IS NOT NULL 
            `;
            if (isDesc) {
                query += `ORDER BY ${col} DESC `;
            }
            else query += `ORDER BY ${col} ASC `;

            if (limit) {
                query += `LIMIT ${limit} `;
            }
            return db.manyOrNone(query);
        } catch (error) {
            console.log('Select top by property error: ', error);
        }
    },

    select: async (tbName, col, val) => {
        try {
            const query = `
                SELECT *
                FROM "${tbName}"
                WHERE "${col}" = '${val}'
            `;
            return db.oneOrNone(query);
        } catch (error) {
            console.log('Select property by condition error: ', error);
        }
    },

    selectMany: async (tbName, col, val) => {
        try {
            const query = `
                SELECT *
                FROM "${tbName}"
                WHERE "${col}" = '${val}'
            `;
            return db.manyOrNone(query);
        } catch (error) {
            console.log('Select property by condition error: ', error);
        }
    },

    count: async (tbName) => {
        try {
            const query = `
                SELECT COUNT(*) 
                FROM "${tbName}"
            `;
            const result = await db.one(query);
            return parseInt(result.count, 10);
        } catch (error) {
            console.log('Count error: ', error);
        }
    },

    joinTB: async (tb1, tb2, col1, col2, val) => {
        try {
            const query = `
                SELECT *
                FROM "${tb1}"
                JOIN "${tb2}" ON "${tb1}"."${col1}" = "${tb2}"."${col1}"
                WHERE "${col2}" = $1
            `;
            return db.manyOrNone(query, [val]);
        } catch (error) {
            console.log("Join table error: ", error);
        }
    },

    joinTB: async (tb1, tb2, col1, col2, colWhere, val, colOrder, isDesc, limit) => {
        try {
            let query = `
                SELECT *
                FROM "${tb1}"
                JOIN "${tb2}" ON "${tb1}"."${col1}" = "${tb2}"."${col2}"
                WHERE "${colWhere}" = $1
            `;
            if (colOrder) {
                if (isDesc) {
                    query += `ORDER BY "${colOrder}" DESC `;
                }
                else query += `ORDER BY "${colOrder}" ASC `;
            }

            if (limit) {
                query += `LIMIT ${limit} `;
            }
            return db.manyOrNone(query, [val]);
        } catch (error) {
            console.log("Join table error: ", error);
        }
    },

    update: async (tbName, col, colval, id, val) => {
        try {
            let query = `UPDATE "${tbName}" SET `;
            for (let i = 0; i < col.length; i++) {
                // Parameterize values to prevent SQL injection
                query += `"${col[i]}" = $${i + 1}, `;
            }
            query = query.slice(0, -2); // Remove the trailing comma and space
            query += ` WHERE "${id}" = $${col.length + 1}`;

            // Combine column values and the identifier value for parameterization
            const values = [...colval, val];
            console.log(query, values);
            const result = await db.result(query, values);
            return result.rowCount;
        } catch (error) {
            console.log('Select property by condition error: ', error);
        }
    },
    searchAll: async (tbName, searchTerm) => {
        try {
            const query = `
            SELECT * FROM "${tbName}"
            WHERE LOWER("Ten") ILIKE LOWER($1)`;
            const data = await db.any(query, [`%${searchTerm}%`]);
            return data;
        } catch (error) {
            console.log('Search error: ', error);
        }
    },

    joinTBSearch: async (tb1, tb2, col1, col2, colWhere, val, colOrder, isDesc, limit, input) => {
        try {
            let query = `
                SELECT *
                FROM "${tb1}"
                JOIN "${tb2}" ON "${tb1}"."${col1}" = "${tb2}"."${col2}"
                WHERE "${colWhere}" = $1 
            `;
            // if (colOrder) {
            //     if (isDesc) {
            //         query += `ORDER BY ${colOrder} DESC `;
            //     }
            //     else query += `ORDER BY ${colOrder} ASC `;
            // }

            // if (limit) {
            //     query += `LIMIT ${limit} `;
            // }

            query += `AND LOWER("${tb1}"."Ten") ILIKE LOWER($2)`;
            return db.manyOrNone(query, [val, `%${input}%`]);
        } catch (error) {
            console.log("Join table error: ", error);
        }
    },

    selectByQuery: async(queryString) => {
        try {
            return db.manyOrNone(queryString);
        }
        catch(error) {
            console.log('query error:', error);
        }
    },
    joinTBnGetAll: async (tb1, tb2, col1, col2, colOrder, isDesc, limit) => {
        try {
            let query = `
                SELECT *
                FROM "${tb1}"
                JOIN "${tb2}" ON "${tb1}"."${col1}" = "${tb2}"."${col2}"
            `;
            if (colOrder) {
                if (isDesc) {
                    query += `ORDER BY "${colOrder}" DESC `;
                }
                else query += `ORDER BY "${colOrder}" ASC `;
            }

            if (limit) {
                query += `LIMIT ${limit} `;
            }
            return db.manyOrNone(query);
        } catch (error) {
            console.log("Join table error: ", error);
        }
    },
    searchAll: async (tbName, searchTerm, col) => {
        try {
            const query = `
            SELECT * FROM "${tbName}"
            WHERE LOWER("${col}") ILIKE LOWER($1)`;
            const data = await db.any(query, [`%${searchTerm}%`]);
            return data;
        } catch (error) {
            console.log('searchAll error: ', error);
        }
    },
}