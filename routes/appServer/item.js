var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var functions = require('../../public/javascripts/functions/functions');

router.post('/create', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        console.log(req.session.user);
        var FromData = req.body;

        var todayString = await functions.TodayString();
        FromData.reg_date = todayString;

        console.log(FromData);
        await itemModel.INSERT_ITEMS(FromData);
        var ITEM_SEQ = await itemModel.GET_ITEMS_SEQ();
        res.status(200).send({item_seq : ITEM_SEQ});
    } catch (err) {
        console.log(err)
    }
});

router.get('/list', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        console.log(req.body)
    } catch (err) {

    }
})

module.exports = router;
