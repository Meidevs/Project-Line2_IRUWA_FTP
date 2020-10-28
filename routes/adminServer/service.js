var express = require('express');
var router = express.Router();
var adminModel = require('../../public/javascripts/components/adminModel');

function errorHandler(res) {
    res.status(500);
    res.send('비정상 접근입니다.');
}
router.get('/', (req, res) => {
    if (!req.session.user) return errorHandler(res);
    res.status(200).render('iruwa_admin_service');
});

router.get('/notifications', async (req, res) => {
    try {
        var notiList = await adminModel.getAllNotifications();
        res.status(200).send(notiList)
    } catch (err) {
        console.log(err);
    }
});

router.get('/bannedkeywords', async (req, res) => {
    try {
        var notiList = await adminModel.getAllBannedKeywords();
        res.status(200).send(notiList)
    } catch (err) {
        console.log(err);
    }
});

router.post('/setnotification', async (req, res) => {
    try {
        var FromData = new Object();
        var resReturn = {
            flags : 1,
            message : '공지사항 등록에 실패하였습니다.'
        }
        FromData.title = req.body.title;
        FromData.content = req.body.content;

        var now = new Date();
        var dateString =  now.toISOString().substring(0,10);

        FromData.reg_date = dateString;
        var setNotiResult = await adminModel.setNotifications(FromData);
        if(setNotiResult) {
            resReturn = {
                flags : 0,
                message : '공지사항을 등록하였습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.post('/setbannedkeyword', async (req, res) => {
    try {
        var FromData = new Object();
        var resReturn = {
            flags : 1,
            message : '금지어 등록에 실패하였습니다.'
        }
        FromData.keyword = req.body.keyword;
        var setBannedResult = await adminModel.setBannedKeyword(FromData);
        if(setBannedResult) {
            resReturn = {
                flags : 0,
                message : '금지어를 등록하였습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.post('/removenotification', async (req, res) => {
    try {
        var FromData = new Object();
        var resReturn = {
            flags : 1,
            message : '삭제에 실패하였습니다.'
        }
        FromData.notification_seq = req.body.notification_seq;
        var removeResult = await adminModel.removeNotifications(FromData);
        if (removeResult) {
            resReturn = {
                flags : 0,
                message : '삭제되었습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.post('/removebannedkeyword', async (req, res) => {
    try {
        var FromData = new Object();
        var resReturn = {
            flags : 1,
            message : '삭제에 실패하였습니다.'
        }
        FromData.banned_seq = req.body.banned_seq;
        var removeResult = await adminModel.removeBannedKeyword(FromData);
        if (removeResult) {
            resReturn = {
                flags : 0,
                message : '삭제되었습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;