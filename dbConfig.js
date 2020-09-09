const mysql = require('mariadb');

var dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'admin',
    password: 'password',
    database: 'iruwa',
};

const pool = mysql.createPool(dbConfig);
module.exports = pool;