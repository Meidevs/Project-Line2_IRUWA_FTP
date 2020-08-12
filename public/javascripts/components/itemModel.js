var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');

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

    INSERT_ITEMS(data) {
        return new Promise(
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
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_items';
                    var resRetrun = await myConnection.query(sql);
                    resolve(resRetrun[0].cnt);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_ITEMS_LIST(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    // After Put Ads Date
                    var sql = 'SELECT * FROM tb_items WHERE cmp_seq IN (SELECT cmp_seq FROM tb_company WHERE cmp_location = ?)';
                    var resReturn = await myConnection.query(sql, [data.location_name]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_IMAGE_URI(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = '\n';
                    sql += "SELECT * ";
                    sql += "FROM tb_images ";
                    sql += "WHERE items_seq IN (";
                    sql += data.join();
                    sql += ")";
                    var IMAGE_URIs = await myConnection.query(sql);
                    resolve(IMAGE_URIs);
                } catch (err) {
                    reject(err);

                }
            }
        )
    }

    GET_CMP_ITEM_COUNT(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_items WHERE cmp_seq = ?';
                    var ITEM_COUNT = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(ITEM_COUNT[0].cnt);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_ITEM_OWNER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT user_seq FROM tb_company WHERE cmp_seq IN (SELECT cmp_seq FROM tb_items WHERE items_seq = ?)'
                    var USER_SEQ = await myConnection.query(sql, [data.items_seq]);
                    resolve(USER_SEQ[0].user_seq);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    USER_PICK_EXISTENCE(user_seq, items_seq) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var resRetrun = false;
                    var sql = 'SELECT * FROM tb_user_pick WHERE user_seq = ? AND items_seq = ?';
                    var EXISTENCE = await myConnection.query(sql, [user_seq, items_seq]);
                    if (EXISTENCE[0] != undefined) {
                        resRetrun = true;
                    }
                    resolve(resRetrun)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    DELETE_USER_PICK_ITEM(user_seq, items_seq) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_user_pick WHERE user_seq = ? AND items_seq = ?';
                    await myConnection.query(sql, [user_seq, items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    USER_PICK_ITEM(user_seq, items_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_user_pick (user_seq, items_seq) VALUES (?, ?)';
                    await myConnection.query(sql, [user_seq, items_seq]);
                    resolve(true)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_PICK_COUNT() {
        return new Promise(
            async (resolve, reject) => {
                try {

                } catch (err) {

                }
            }
        )
    }
}

module.exports = new Items();