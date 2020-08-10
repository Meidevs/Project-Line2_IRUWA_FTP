var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');
const { rejectSeries } = require('async');

class Authentication {

    SELECT_ALL_USERS() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var ALL_USERS = await myConnection.query('SELECT * FROM tb_users');
                    resolve(ALL_USERS);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    CHECK_USER_EXISTENCE(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var flags = 1;
                    var sql = 'SELECT 1 AS user_id FROM tb_users WHERE EXISTS (SELECT user_id FROM tb_users WHERE user_id = ?)';
                    var USER_EXISTENCE = await myConnection.query(sql, [data.user_id]);
                    if (USER_EXISTENCE[0] == undefined) {
                        flags = 0;
                    }
                    resolve(flags);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    CHECK_CMP_EXISTENCE(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var flags = 1;
                    var sql = 'SELECT 1 AS cmp_id FROM tb_company WHERE EXISTS (SELECT cmp_id FROM tb_company WHERE cmp_id = ?)';
                    var CMP_EXISTENCE = await myConnection.query(sql, [data.user_id]);
                    if (CMP_EXISTENCE[0] == undefined) {
                        flags = 0;
                    }
                    resolve(flags);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    LOGIN_USER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = {
                        flags: 1,
                        message: '비밀번호가 맞지 않습니다.',
                    };
                    var sql = 'SELECT * FROM tb_users WHERE user_id = ? AND user_pw = ?';
                    var USER_INFO = await myConnection.query(sql, [data.user_id, data.user_pw]);

                    if (USER_INFO[0] != undefined) {
                        resReturn = {
                            flags: 0,
                            message : '로그인 되었습니다.',
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

    LOGIN_CMP(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = {
                        flags: 1,
                        message: '비밀번호가 맞지 않습니다.',
                    };
                    var sql = 'SELECT * FROM tb_company WHERE cmp_id = ? AND cmp_pw = ?';
                    var CMP_INFO = await myConnection.query(sql, [data.cmp_id, data.cmp_pw]);

                    if (CMP_INFO[0] != undefined) {
                        resReturn = {
                            flags: 0,
                            message : '로그인 되었습니다.',
                            userSession: CMP_INFO[0],
                        }
                    }
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    REGISTER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_users (user_id, user_pw, user_name, user_phone, user_email, reg_date) VALUES (?, ?, ?, ?, ?, ?)';
                    await myConnection.query(sql, [data.user_id, data.user_pw, data.user_name, data.user_phone, data.user_email, data.reg_date]);
                    resolve()
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

}

module.exports = new Authentication();