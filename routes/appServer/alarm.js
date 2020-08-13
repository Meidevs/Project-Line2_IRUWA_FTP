var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var alarmModel = require('../../public/javascripts/components/alarmModel');
var functions = require('../../public/javascripts/functions/functions');
const { resourceUsage } = require('process');

router.post('/alarm/keywords/create', async (req, res) => {
    try {
        var user_seq = req.session.user.user_seq;
        var keywords = req.body.keywords;
        var resReturn = {
            flags : 1,
            message : '키워드가 입력에 실패하였습니다.'
        }
        var dateString = await functions.TodayString();
        var CREATE_RESPONSE = await alarmModel.CREATE_KEYWORDS(user_seq, keywords, dateString);
        if (CREATE_RESPONSE == true) {
            resReturn = {
                flags : 0,
                message : '키워드가 입력되었습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/alarm/keywords/list', async (req, res) => {
    try {
        var user_seq = req.session.user.user_seq;
        var resReturn = {
            flags : 1,
            message : '키워드 호출에 실패하였습니다.',
        }
        var READ_RESPONSE = await alarmModel.READ_KEYWORDS(user_seq);
        if (READ_RESPONSE[0] != undefined) {
            resReturn = {
                flags : 0,
                messgage : '키워드를 호출하였습니다.',
                keywords : READ_RESPONSE,
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.post('/alarm/keywords/delete', async (req, res) => {
    try {
        var keywords = req.body.keywords_seq;
        var resReturn = {
            flags : 1,
            message : '키워드 삭제를 실패하였습니다.',
        }
        var DELETE_RESPONSE = await alarmModel.DELETE_KEYWORDS(keywords);
        if (DELETE_RESPONSE == true) {
            resReturn = {
                flags : 0,
                message : '키워드를 삭제하였습니다.',
            }
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/alarm/keywords/load', async (req, res) => {
    try {
        
    } catch (err) {
        console.log(err);
    }
});

router.get('/alarm/chat', async (req, res) => {
    try {

    } catch (err) {
        
    }
});

router.get('/alarm/notification', async (req, res) => {
    try {

    } catch (err) {

    }
})

module.exports = router;
