var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');
const { rejectSeries } = require('async');

class Items {
    SELECT_ALL_CATEGORIES() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var ALL_CATEGORIES = await myConnection.query('SELECT * FROM tb_categories');
                    resolve(ALL_CATEGORIES);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    INSERT_ITEMS (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_items (cmp_seq, item_name, item_content, reg_date) VALUES (?, ?, ?, ?)';
                    await myConnection.query(sql, [data.cmp_seq, data.item_name, data.item_content, data.reg_date])
                    resolve(true);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_ITEMS_SEQ() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_items';
                    var resRetrun  = await myConnection.query(sql);
                    resolve(resRetrun[0].cnt);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
}

module.exports = new Items();