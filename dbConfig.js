const mysql = require('mariadb');

var dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'iruwa',
};

const pool = mysql.createPool(dbConfig);
module.exports = pool;
