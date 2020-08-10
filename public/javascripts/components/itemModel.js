var myConnection = require('../../../dbConfig');
var functions = require('../functions/functions');
const { rejectSeries } = require('async');

class Items {

    SELECT_ALL_CATEGORIES() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var ALL_CATEGORIES = await myConnection.query('SELECT * FROM tb_categories');
                    console.log(ALL_CATEGORIES)
                    resolve(ALL_CATEGORIES);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
}

module.exports = new Items();