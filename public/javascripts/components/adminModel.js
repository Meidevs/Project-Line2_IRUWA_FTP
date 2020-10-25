const { memoryUsage } = require('process');
var myConnection = require('../../../dbConfig');

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
                    var sql = 'SELECT items_seq, COUNT(*) AS cnt FROM tb_view GROUP BY items_seq ORDER BY COUNT(*) DESC';
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
                    var sql = "SELECT * FROM tb_company WHERE cmp_seq IN (SELECT cmp_seq FROM tb_items WHERE items_seq IN (" + data + "))";
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

    getCategoryList() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT categories.category_seq, categories.category_name, (SELECT icons.uri FROM tb_category_icons icons WHERE icons.category_seq = categories.category_seq) AS uri FROM tb_categories categories';
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getItemCount() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT category_seq, COUNT(*) AS cnt FROM tb_company GROUP BY category_seq';
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getUnuseCoupon(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_admin_coupons WHERE used = "N" ORDER BY admin_coupon_seq ASC limit ?';
                    var resReturn = await myConnection.query(sql, [data]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    updateUnuseCoupon(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_admin_coupons SET used = "Y" WHERE admin_coupon_seq IN (' + data.join() + ')';
                    await myConnection.query(sql);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getCouponList(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT coupon, due_date FROM tb_user_coupons WHERE user_email = ?';
                    var resReturn = await myConnection.query(sql, [data.user_email]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getAllCompany() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_company ORDER BY ads_date ASC';
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getCompanyDuedate(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT ads_date FROM tb_company WHERE cmp_seq = ?';
                    var cmpInfo = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(cmpInfo)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getCompanyPreDuedate(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT pre_ads_date FROM tb_company WHERE cmp_seq = ?';
                    var cmpInfo = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(cmpInfo)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    renewDueDate(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_company SET ads_date = ?, normal_ads = "Y" WHERE cmp_seq = ?';
                    await myConnection.query(sql, [data.due_date, data.cmp_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    changeToPremiums(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    console.log(data)
                    var sql = 'UPDATE tb_company SET ads_date = ?, pre_ads_date = ?,  normal_ads = "Y", pre_ads = "Y" WHERE cmp_seq = ?';
                    await myConnection.query(sql, [data.due_date, data.pre_due_date, data.cmp_seq])
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    setCategory(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_categories (category_name) VALUES (?)';
                    await myConnection.query(sql, [data.category_name]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    deleteCategory(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_categories WHERE category_seq = ?';
                    await myConnection.query(sql, [data.category_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    deleteCategoryIcon(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_category_icons WHERE category_seq = ?';
                    await myConnection.query(sql, [data.category_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getLastCategoryNum() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT category_seq FROM tb_categories ORDER BY category_seq DESC LIMIT 1';
                    var resReturn = await myConnection.query(sql);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    setCategoryIcon(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    data.icon_name = 'https://mostfeel.site:443/icons/' + data.icon_name + '.png';
                    var sql = 'INSERT INTO tb_category_icons (category_seq, uri) VALUES (?, ?)';
                    await myConnection.query(sql, [data.category_seq, data.icon_name]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new Admin();