var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');

class Alarm {
    CREATE_KEYWORDS (USER_SEQ, keywords, dateString) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_user_keywords (user_seq, keywords, reg_date) VALUES (?, ?, ?)';
                    await myConnection.query(sql, [USER_SEQ, keywords, dateString]);
                    resolve(true);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    READ_KEYWORDS(USER_SEQ) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_user_keywords WHERE user_seq = ?';
                    var resReturn = await myConnection.query(sql, [USER_SEQ]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    DELETE_KEYWORDS (keywords_seq) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_user_keywords WHERE keywords_seq = ?';
                    await myConnection.query(sql, [keywords_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

}

module.exports = new Alarm();