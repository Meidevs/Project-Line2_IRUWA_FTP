const { reject } = require('async');
var myConnection = require('../../../dbConfig');
const { notify } = require('../../../routes/adminServer/item');
var functions = require('../functions/functions');

class Admin {
    CHECK_ADMIN_EXISTENCE(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var flags = 1;
                    var sql = 'SELECT 1 AS user_id FROM tb_users WHERE EXISTS (SELECT user_id FROM tb_admins WHERE user_id = ?)';
                    var USER_EXISTENCE = await myConnection.query(sql, [data.user_id]);
                    if (USER_EXISTENCE[0] == undefined) {
                        flags = 0;
                    }
                    resolve(flags);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    LOGIN_ADMIN(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = {
                        flags: 1,
                        message: '비밀번호가 맞지 않습니다.',
                    };
                    var sql = 'SELECT * FROM tb_admins WHERE user_id = ? AND user_pw = ?';
                    var USER_INFO = await myConnection.query(sql, [data.user_id, data.user_pw]);
                    if (USER_INFO[0] != undefined) {
                        resReturn = {
                            flags: 0,
                            message: '로그인 되었습니다.',
                            userSession: USER_INFO[0],
                        }
                    }
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_NOTIFICATIONS() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_notifications';
                    var NOTIFICATIONS = await myConnection.query(sql);
                    resolve(NOTIFICATIONS);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    getHighestView() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT items_seq, COUNT(*) FROM tb_view GROUP BY items_seq ORDER BY COUNT(*) DESC';
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getHighestViewItem(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = "SELECT * FROM tb_items WHERE items_seq IN (" + data + ")";
                    console.log(sql);
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getCompanyInfo(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = "SELECT * FROM tb_company WHERE cmp_seq IN (SELECT * FROM tb_items WHERE items_seq IN (" + data + "))";
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getNewCompany() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var year = new Date().getFullYear();
                    var month = new Date().getMonth();
                    var day = new Date().getDate();
                    var daysAgo = new Date(year, month, day - 2).toISOString().substring(0, 10);
                    var sql = 'SELECT * FROM tb_company WHERE reg_date > ?';
                    var resReturn = await myConnection.query(sql, [daysAgo]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getCategories() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT  categories.category_seq, categories.category_name, (SELECT uri FROM tb_category_icons WHERE category_seq = categories.category_seq) FROM tb_categories categories';
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new Admin();