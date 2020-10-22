var myConnection = require('../../../dbConfig');
// var functions = require('../functions/functions');
// const { moveCursor } = require('readline');
// const { reject } = require('async');
// const { resolve } = require('path');
// const { response } = require('express');

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

    SELECT_ALL_CATEGORY_IMAGES() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var ALL_CATEGORY_IMAGES = await myConnection.query('SELECT * FROM tb_category_icons');
                    resolve(ALL_CATEGORY_IMAGES);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    INSERT_ITEMS(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_items (cmp_seq, item_name, item_content, reg_date, ads_type) VALUES (?, ?, ?, ? , ?)';
                    await myConnection.query(sql, [data.cmp_seq, data.item_name, data.item_content, data.reg_date, data.ads_type])
                    resolve(true);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    UPDATE_ITEMS(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_items SET item_name = ? , item_content = ?, reg_date = ? WHERE items_seq = ?';
                    await myConnection.query(sql, [data.item_name, data.item_content, data.reg_date, data.items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    DELETE_ITEM(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_items SET cancelled = 1 WHERE items_seq = ?';
                    await myConnection.query(sql, [data.items_seq])
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
                    var now = new Date().toISOString().substring(0,10);
                    // After Put Ads Date
                    var sql = 'SELECT * FROM tb_items WHERE cancelled = 0 AND cmp_seq IN (SELECT cmp_seq FROM tb_company WHERE cmp_location = ? AND ads_date >= ?) ORDER BY reg_date DESC';
                    var resReturn = await myConnection.query(sql, [data.location_name, now]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_ITEMS_LIST_ON_CATEGORY(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    // After Put Ads Date
                    var sql = 'SELECT * FROM tb_items WHERE cancelled = 0 AND cmp_seq IN (SELECT cmp_seq FROM tb_company WHERE category_seq = ? AND cmp_location = ?) ORDER BY reg_date DESC';
                    var resReturn = await myConnection.query(sql, [data.category_seq, data.user_location]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_ITEM_PREMIUM_LIST(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT *, (SELECT cmp_name FROM tb_company cmp WHERE cmp.cmp_seq = items.cmp_seq) AS cmp_name FROM tb_items items WHERE cancelled = 0 AND cmp_seq IN (SELECT cmp_seq FROM tb_company WHERE cmp_location = ?) AND ads_type = 1 ORDER BY reg_date DESC';
                    var resReturn = await myConnection.query(sql, [data.location_name]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_ITEM_PREMIUM_LIST_WITH_CMP(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT *, (SELECT cmp_name FROM tb_company cmp WHERE cmp.cmp_seq = items.cmp_seq) AS cmp_name FROM tb_items items WHERE cancelled = 0 AND cmp_seq IN (SELECT cmp_seq FROM tb_company WHERE cmp_location = ?) AND ads_type = 1 ORDER BY reg_date DESC';
                    var resReturn = await myConnection.query(sql, [data.location_name]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    GET_ITEMS_LIST_ON_OWNER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * , (SELECT COUNT(*) FROM tb_user_pick WHERE items_seq = items.items_seq) AS cnt FROM tb_items items WHERE cmp_seq = ? AND cancelled = 0';
                    var ITEMS_OF_OWNER = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(ITEMS_OF_OWNER);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_ITEMS_LIST_ON_OWNER_WITH_COUPON (data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * , (SELECT COUNT(*) FROM tb_user_pick WHERE items_seq = items.items_seq) AS cnt, (SELECT coupon_content FROM tb_items_coupon WHERE items_seq = items.items_seq) AS coupon_content, (SELECT coupon_due_date FROM tb_items_coupon WHERE items_seq = items.items_seq) AS coupon_due_date FROM tb_items items WHERE cmp_seq = ? AND cancelled = 0;';
                    var ITEMS_OF_OWNER = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(ITEMS_OF_OWNER);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_ITEMS_LIST_OF_PICK(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT items.items_seq, items.item_name,items.item_content, items.reg_date, items.ads_type, cmp.cmp_seq, cmp.cmp_name, cmp.cmp_location, (SELECT COUNT(*) FROM tb_user_pick WHERE items_seq = items.items_seq) AS cnt FROM tb_items items INNER JOIN tb_company cmp ON cmp.cmp_seq = items.cmp_seq WHERE items_seq IN (SELECT items_seq FROM tb_user_pick WHERE user_seq = ?)';
                    var LIST_OF_PICK = await myConnection.query(sql, [data.user_seq]);
                    resolve(LIST_OF_PICK);
                } catch (err) {
                    reject(err);
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

    GET_CMP_PRE_ITEM_COUNT(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_items WHERE cmp_seq = ? AND ads_type = 1';
                    var ITEM_COUNT = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(ITEM_COUNT[0].cnt);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_PICK_OWNER(data) {
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
    USER_PICK_EXISTENCE(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var resRetrun = false;
                    var sql = 'SELECT * FROM tb_user_pick WHERE user_seq = ? AND items_seq = ?';
                    var EXISTENCE = await myConnection.query(sql, [data.user_seq, data.items_seq]);
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
    DELETE_USER_PICK_ITEM(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_user_pick WHERE user_seq = ? AND items_seq = ?';
                    await myConnection.query(sql, [data.user_seq, data.items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    USER_PICK_ITEM(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_user_pick (user_seq, items_seq) VALUES (?, ?)';
                    await myConnection.query(sql, [data.user_seq, data.items_seq]);
                    resolve(true)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_PICK_COUNT(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_user_pick WHERE items_seq = ?';
                    var PICK_COUNT = await myConnection.query(sql, [data.items_seq]);
                    resolve(PICK_COUNT[0].cnt);
                } catch (err) {
                    reject(err);
                }

            }
        )
    }
    GET_VIEW_OWNER(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_view WHERE user_seq = ?  AND items_seq = ?';
                    var VIEW_OWNER = await myConnection.query(sql, [data.user_seq, data.items_seq]);
                    resolve(VIEW_OWNER[0].cnt);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    UPDATE_VIEW_COUNT(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_view (user_seq, items_seq) VALUES (?, ?)';
                    await myConnection.query(sql, [data.user_seq, data.items_seq]);
                    resolve(true)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    GET_VIEW_COUNT(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT COUNT(*) AS cnt FROM tb_view WHERE items_seq = ?';
                    var VIEW_COUNT = await myConnection.query(sql, [data.items_seq]);
                    resolve(VIEW_COUNT[0].cnt);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    SAVE_IMAGE_URI(items_seq, images) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var hostname = 'https://mostfeel.site/';
                    for (var i = 0; i < images.length; i++) {
                        var uri = hostname + 'item_images/' + images[i].filename;
                        var sql = 'INSERT INTO tb_images (items_seq, uri) VALUES (?, ?)';
                        await myConnection.query(sql, [items_seq, uri])
                    }
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    DELETE_IMAGE_URI(items_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_images WHERE items_seq = ?';
                    await myConnection.query(sql, [items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_SEARCH_HISTORY(user_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT keyword FROM tb_user_prev_search WHERE user_seq = ?';
                    var resReturn = await myConnection.query(sql, [user_seq]);
                    resolve(resReturn)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    INSERT_SEARCH_HISTORY(user_seq, keyword) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_user_prev_search (user_seq, keyword) VALUES (?, ?)';
                    await myConnection.query(sql, [user_seq, keyword]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    DELETE_SEARCH_HISTORY(user_seq, keyword) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_user_prev_search WHERE user_seq = ? AND keyword = ?';
                    await myConnection.query(sql, [user_seq, keyword]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    DELETE_SEARCH_HISTORY_ALL(user_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_user_prev_search WHERE user_seq = ?';
                    await myConnection.query(sql, [user_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_ITEM_INFO(items_seq) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_items WHERE items_seq = ?';
                    var resReturn = await myConnection.query(sql, [items_seq]);
                    resolve(resReturn[0])
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    GET_COUPON_INFO(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_items_coupon WHERE items_seq = ?';
                    var resReturn = await myConnection.query(sql, [data.items_seq]);
                    resolve(resReturn);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    SEARCH_ITEM(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    data.keyword = '%' + data.keyword + '%';
                    var sql = 'SELECT * FROM tb_items WHERE cancelled = 0 AND item_name LIKE ? OR item_content LIKE ? AND cmp_seq IN (SELECT cmp_seq FROM tb_company WHERE cmp_location = ?) ORDER BY reg_date DESC';
                    var SERACH_RETURN = await myConnection.query(sql, [data.keyword, data.keyword, data.location_name]);
                    resolve(SERACH_RETURN);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    INSERT_PHONE_LIST(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_phone_list (cmp_seq, name, position, phone) VALUES (?, ?, ?, ?)';
                    await myConnection.query(sql, [data.cmp_seq, data.name, data.position, data.phone]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    DELETE_PHONE_LIST(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_phone_list WHERE phone_seq = ?';
                    await myConnection.query(sql, [data.phone_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    GET_PHONE_LIST(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM tb_phone_list WHERE cmp_seq = ?';
                    var PHONE_LIST = await myConnection.query(sql, [data.cmp_seq]);
                    resolve(PHONE_LIST);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    UPDATE_COUPON (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_items_coupon SET coupon_content = ?, coupon_due_date = ? WHERE items_seq = ?';
                    await myConnection.query(sql, [data.coupon_content, data.coupon_due_date, data.items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    SET_COUPON (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'INSERT INTO tb_items_coupon (items_seq, coupon_content, coupon_due_date) VALUES (?, ?, ?)';
                    await myConnection.query(sql, [data.items_seq, data.coupon_content, data.coupon_due_date]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    DELETE_COUPON (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'DELETE FROM tb_items_coupon WHERE items_seq = ?';
                    await myConnection.query(sql, [data.items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    RESET_REG_DATE (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE tb_items SET reg_date = ? WHERE items_seq = ?';
                    await myConnection.query(sql, [data.reg_date, data.items_seq]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new Items();
