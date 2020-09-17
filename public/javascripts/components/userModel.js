var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');
const { rejectSeries } = require('async');
const { type } = require('os');

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

    GET_USER_COUNT() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_users';
                    var USER_COUNT = await myConnection.query(sql);
                    resolve(USER_COUNT[0].cnt);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    REGISTER_USER_ALARM(USER_SEQ) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    console.log(USER_SEQ)
                    var sql = 'INSERT INTO tb_user_alarm (user_seq) VALUES (?)';
                    await myConnection.query(sql, [USER_SEQ]);
                    resolve(true);
                } catch (err) {
                    reject(err)
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
    GET_USER_ALARM_STATE(USER_SEQ) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT main_alarm, sub_alarm FROM tb_user_alarm WHERE user_seq = ?';
                    var USER_ALARM_STATE = await myConnection.query(sql, [USER_SEQ]);
                    console.log('USER_ALARM_STATE :', USER_ALARM_STATE)
                    resolve(USER_ALARM_STATE[0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    GET_USER_INFO_ON_CMP (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var rawObj = new Object();
                    var sql = 'SELECT * FROM tb_users WHERE user_seq IN (SELECT user_seq FROM tb_company WHERE cmp_seq = ?)';
                    var HOST_INFO = await myConnection.query(sql, [data.cmp_seq]);
                    rawObj.user_seq = HOST_INFO[0].user_seq;
                    rawObj.user_name = HOST_INFO[0].user_name;
                    resolve(rawObj)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    GET_CMP_INFO_ON_USER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = false;
                    var sql = 'SELECT * FROM tb_company WHERE user_seq = ?';
                    var CMP_INFO = await myConnection.query(sql, [data.userSession.user_seq]);
                    if (CMP_INFO[0] != undefined) {
                        data.userSession.cmp_seq = CMP_INFO[0].cmp_seq,
                            data.userSession.category_seq = CMP_INFO[0].category_seq,
                            data.userSession.cmp_name = CMP_INFO[0].cmp_name,
                            data.userSession.cmp_phone = CMP_INFO[0].cmp_phone,
                            data.userSession.cmp_location = CMP_INFO[0].cmp_location,
                            data.userSession.cmp_certificates = CMP_INFO[0].cmp_certificates,
                            data.userSession.reg_date = CMP_INFO[0].reg_date,
                            data.userSession.ads_date = CMP_INFO[0].ads_date,
                            data.userSession.ads_pre_date = CMP_INFO[0].ads_pre_date,

                            resReturn = {
                                flags: 0,
                                message: '로그인 되었습니다.',
                                userSession: data.userSession,
                            }
                    }
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_CMP_INFO(cmp_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var rawObj = new Object();
                    var sql = 'SELECT * FROM tb_company WHERE cmp_seq = ?';
                    var CMP_INFO = await myConnection.query(sql, [cmp_seq]);
                    rawObj.cmp_seq = CMP_INFO[0].cmp_seq
                    rawObj.category_seq = CMP_INFO[0].category_seq
                    rawObj.cmp_name = CMP_INFO[0].cmp_name
                    rawObj.cmp_phone = CMP_INFO[0].cmp_phone
                    rawObj.cmp_location = CMP_INFO[0].cmp_location
                    rawObj.cmp_certificates = CMP_INFO[0].cmp_certificates
                    rawObj.reg_date = CMP_INFO[0].reg_date
                    rawObj.ads_date = CMP_INFO[0].ads_date
                    rawObj.ads_pre_date = CMP_INFO[0].ads_pre_date
                    resolve(rawObj);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    REGISTER_USER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = {
                        flags: 0,
                        message: '회원가입되었습니다.'
                    }
                    var cmp_exist = 'N';
                    if (data.status == 1) {
                        cmp_exist = 'Y'
                    }
                    var sql = 'INSERT INTO tb_users (user_id, user_pw, user_name, user_phone, user_email,user_location,cmp_exist, reg_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                    var response = await myConnection.query(sql, [data.user_id, data.user_pw, data.user_name, data.user_phone, data.user_email, data.user_location, cmp_exist, data.reg_date]);
                    console.log(response)
                    resolve(resReturn)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    REGISTER_CMP(USER_SEQ, data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = {
                        flags: 0,
                        message: '회원가입 및 업체가 등록되었습니다.'
                    }
                    var sql = 'INSERT INTO tb_company (user_seq, category_seq, cmp_name, cmp_phone, cmp_location, cmp_detail_location, cmp_lat, cmp_lon, cmp_certificates, reg_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    var response = await myConnection.query(sql, [USER_SEQ, data.category_seq, data.cmp_name, data.cmp_phone, data.cmp_location, data.cmp_detail_location, data.lat, data.lon, data.cmp_certificates, data.reg_date]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_CMP_LIST(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_company WHERE cmp_location = ?';
                    var resReturn = await myConnection.query(sql, [data.location_name]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_RESTIME_AVG(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT res_time FROM tb_restime_avg WHERE cmp_seq = ?';
                    var resReturn = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    USER_LOCATION_UPDATE(user_location, user_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_users SET user_location = ? WHERE user_seq = ?';
                    var UPDATE_RESPONSE = await myConnection.query(sql, [user_location, user_seq]);
                    if (UPDATE_RESPONSE.affectedRows > 0) {
                        resolve(true);
                    }
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_CMP_ADS_PERMISSTION (data) {
         return new Promise (
             async (resolve, reject) => {
                 try {
                    var sql = 'SELECT normal_ads, pre_ads FROM tb_company WHERE cmp_seq = ?';
                    var SELECT_RESPONSE = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(SELECT_RESPONSE);
                 } catch (err) {
                    reject(err)
                 }
             }
         )
    }

    GET_CMP_LIST_ON_CATEGORY (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_company WHERE category_seq = ?';
                    var SELECT_RESPONSE = await myConnection.query(sql, [data.category_seq]);
                    resolve(SELECT_RESPONSE);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new Authentication();