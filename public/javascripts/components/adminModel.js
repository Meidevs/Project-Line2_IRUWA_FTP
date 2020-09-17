var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');

class Admin {
    GET_NOTIFICATIONS () {
        return new Promise (
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
}

module.exports = new Admin();