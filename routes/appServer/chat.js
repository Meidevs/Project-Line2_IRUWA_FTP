var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var userModel = require('../../public/javascripts/components/userModel');

router.get('/user/infos', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var resReturn = {
            user_seq : req.session.user.user_seq,
            user_name : req.session.user.user_name,
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err)
    }
});

router.post('/company/infos', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var cmp_seq = req.body.cmp_seq;
        var CMP_INFOs = await userModel.GET_CMP_INFO(cmp_seq);
        var resReturn = {
            cmp_seq : CMP_INFOs.cmp_seq,
            cmp_name : CMP_INFOs.cmp_name,
        }
        res.status(200).send(resReturn)
    } catch (err) {
        console.log(err)
    }
});

router.post('/items/infos', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var items_seq = req.body.items_seq;
        var ITEM_INFOs = await itemModel.GET_ITEM_INFO(items_seq);
        var resReturn = {
            items_seq : ITEM_INFOs.items_seq,
            item_name : ITEM_INFOs.item_name,
        }
        res.status(200).send(resReturn)
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
