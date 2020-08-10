var myConnection = require('../../../mdbConfig.js');

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

    CHECK_USER_ID() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT EXISTS(SELECT userid FROM tb_users WHERE userid = ?';
                    var USER_EXISTENCE = await myConnection.query(sql, [data.userid]);
                    resolve(USER_EXISTENCE);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    LOGIN() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resReturn = new Object();
                    var USER_EXISTENCE = await this.CHECK_USER_ID();
                    if (USER_EXISTENCE == true) {
                        var sql = 'SELECT * FROM tb_users WHERE userid = ?'
                        await myConnection.query(sql, [data.userid]);
                    } else {
                        resReturn = {
                            flags : 1,
                            message : '아이디가 존재하지 않습니다.'
                        }
                    }
                } catch (err) {

                }
            }
        )
    }

}

module.exports = new Authentication();