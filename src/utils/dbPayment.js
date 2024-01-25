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
    if (!await checkDatabaseExists(process.env.DB_DB_PAYMENT)) {
        await createDB(process.env.DB_DB_PAYMENT);
        await create();
    }
    else {
        cn.database = process.env.DB_DB_PAYMENT;
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
    try {
        const cols = [
            { name: 'ID', type: 'SERIAL', primaryKey: true }, 
            { name: 'SoDu', type: 'INT' },
        ];
        await createTB("ThanhToan", cols);
    } catch (error) {
        console.log(`Create table ThanhToan error: `, error);
    }
    
    try {
        const taiKhoanChinh = {
        ID: -1,
        SoDu: 1000000
        };
        const query = {
            text: `INSERT INTO "ThanhToan" ("${Object.keys(taiKhoanChinh).join('", "')}") VALUES(${Object.keys(taiKhoanChinh).map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
            values: Object.values(taiKhoanChinh),
        };
        const result = await db.oneOrNone(query);
        console.log(result);
    } catch (error) {
        console.log(`Create main account error: `, error);
    }
    
}

module.exports = {
    insertWithoutID: async (tbName, entity) => {
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
    },


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
                `DELETE FROM "${tbName}" WHERE ${col} = $1 RETURNING *`, [val]
            );
            if (result.rowCount > 0) {
                console.log(`Deleted row with value ${val} in colmn ${col}`);
            }
            else {
                console.log(`No rows deleted. Row not found`);
            }
        } catch (error) {
            console.log('Delete error: ', error);
        }
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
                    query += `ORDER BY ${colOrder} DESC `;
                }
                else query += `ORDER BY ${colOrder} ASC `;
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

    updateBalance: async(id, newBalance) => {
        try {
            const query = 'UPDATE "ThanhToan" SET "SoDu" = $1 WHERE "ID" = $2';
            const values = [newBalance, id];
            const result = await db.result(query, values);
            return result.rowCount;
        } catch (error) {
            console.log('Update balance error: ', error);
        }
    }
}