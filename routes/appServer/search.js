var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var alarmModel = require('../../public/javascripts/components/alarmModel');
var functions = require('../../public/javascripts/functions/functions');

router.post('/history/update', async (req, res) => {
    try {
        
        var keyword = req.body.keyword;
        var user_seq = req.session.user.user_seq;
        var resReturn = {
            flags : 1,
            message : '동일한 검색 이력'
        }
        const isNegative = (element, index, array) => {
            return element.keyword == keyword;
        }
        var SEARCH_RESPONSE = await itemModel.GET_SEARCH_HISTORY(user_seq);
        var KEYWORD_EXISTENCE = SEARCH_RESPONSE.some(isNegative)
        if (!KEYWORD_EXISTENCE) {
            var INSERT_RESPONSE = await itemModel.INSERT_SEARCH_HISTORY(user_seq, keyword);
            if (INSERT_RESPONSE) {
                resReturn = {
                    flags : 0,
                    message : '이전 검색 이력 조회 성공'
                }
            }
        }
        res.status(200).send({})
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
