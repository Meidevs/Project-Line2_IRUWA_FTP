var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var functions = require('../../public/javascripts/functions/functions');
var userModel = require('../../public/javascripts/components/userModel');

router.post('/create', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var cmp_seq = req.session.user.cmp_seq;
        var FromData = req.body;
        var ITEM_SEQ = 999;
        var todayString = await functions.TodayString();
        FromData.cmp_seq = cmp_seq;
        FromData.reg_date = todayString;

        var ITEM_COUNT = await itemModel.GET_CMP_ITEM_COUNT(FromData);
        if (ITEM_COUNT < 4) {
            await itemModel.INSERT_ITEMS(FromData);
            var ITEM_SEQ = await itemModel.GET_ITEMS_SEQ();
        }
        // api/item/create Endpoint only Insert Text into Database.
        // Image Upload Will be Requested From Browser Again after Application Receive ITEM_SEQ From api/item/create Endpoint.
        res.status(200).send({ item_seq: ITEM_SEQ });
    } catch (err) {
        console.log(err)
    }
});

router.post('/list', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        // api/item/list Endpoint Receive Location Name From Application. 
        // Also, Distinguish Whether Company Pay for ads fee or Not. 
        // This Process Will be Executed by SQL to Accelerate Data Processing.
        var FromData = req.body;
        FromData.location_name = '서울특별시 구로구 구로2동';

        var IMAGE_URIs = new Array();

        // Get Company Information From Database to Show Company Infos At Main Page with Item Information.
        var GET_CMP_LIST = await userModel.GET_CMP_LIST(FromData);
        // Get Items Information From Database Such as item_name, item_content, cmp_seq etc.
        // item_content Might be long String. So, Database dealwith item_content Data As Blob Type. 
        // Server Will encode Blob data to actual Data Which can Read & Understand.
        var GET_ITEM_LIST = await itemModel.GET_ITEMS_LIST(FromData);

        for (var i = 0; i < GET_ITEM_LIST.length; i++) {
            GET_ITEM_LIST[i].item_content = GET_ITEM_LIST[i].item_content.toString();
        }

        // Distinguish & Assemble related Information. 
        GET_ITEM_LIST.map((item) => {
            GET_CMP_LIST.map((data) => {
                if (item.cmp_seq == data.cmp_seq) {
                    item.cmp_name = data.cmp_name;
                    item.cmp_category = data.category_seq;
                    item.cmp_category = data.cmp_location;
                }
            })
        });

        // Extract items_seq As a Array. IMAGE_URIs Array sent to GET_IMAGE_URI Function Which Get Image Uris From Database. 
        for (var j = 0; j < GET_ITEM_LIST.length; j++) {
            IMAGE_URIs.push(GET_ITEM_LIST[j].items_seq);
        }
        var IMAGE_URI_ARRAY = await itemModel.GET_IMAGE_URI(IMAGE_URIs);

        // Push IMAGE_URI datas into GET_ITEM_LIST Array to Send Data to Application Browser.
        GET_ITEM_LIST.map((data) => {
            data.uri = new Array();
            for (var x = 0; x < IMAGE_URI_ARRAY.length; x++) {
                if (data.items_seq == IMAGE_URI_ARRAY[x].items_seq) {
                    data.uri.push(IMAGE_URI_ARRAY[x].uri)
                }
            }
        })
        res.status(200).send({ resReturn: GET_ITEM_LIST });
    } catch (err) {
        console.log(err)
    }
});

router.post('/list/detail/', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        req.query.items_seq = parseInt(req.query.items_seq);
        req.query.cmp_seq = parseInt(req.query.cmp_seq);
        var user_seq = req.session.user.user_seq;
        var queryString = req.query;
        var TIME_AVG = '0:0:0:0';
        PICK_STATUS = false;
        VIEW_COUNT = 0;
        console.log('queryString : ', queryString)
        console.log('user_seq : ', user_seq)

        // Set View Count
        var VIEW_OWNER = await itemModel.GET_VIEW_OWNER(user_seq, queryString.items_seq);
        if (VIEW_OWNER == 0 || null) {
            await itemModel.UPDATE_VIEW_COUNT(user_seq, queryString.items_seq);
        }
        var VIEW_COUNT = await itemModel.GET_VIEW_COUNT(queryString.items_seq);


        // Get Company Response Time Avg.
        var GET_RESTIME_AVG = await userModel.GET_RESTIME_AVG(queryString);
        if (GET_RESTIME_AVG[0] != undefined) {
            TIME_AVG = await functions.TimeAverageCal(GET_RESTIME_AVG);
            console.log(TIME_AVG)
        }

        // Check Whether Application's User Already Pick the Item or Not.
        // If User already Pick the Item, PICK_STATUS Will be true.
        var EXISTENCE = await itemModel.USER_PICK_EXISTENCE(user_seq, queryString.items_seq);
        if (EXISTENCE) {
            PICK_STATUS = true;
        }
        res.status(200).send({VIEW_COUNT : VIEW_COUNT, TIME_AVG : TIME_AVG, PICK_STATUS : PICK_STATUS});
    } catch (err) {
        console.log(err)
    }
});

router.post('/list/detail/pick/', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        req.query.items_seq = parseInt(req.query.items_seq);
        var user_seq = req.session.user.user_seq;
        var queryString = req.query;
        var resReturn = {
            flags: 2,
            message: '본인 상품은 찜할 수 없습니다.'
        }
        var ITEM_OWNER = await itemModel.GET_PICK_OWNER(queryString);
        if (ITEM_OWNER != user_seq) {
            var EXISTENCE = await itemModel.USER_PICK_EXISTENCE(user_seq, queryString.items_seq);
            if (EXISTENCE) {
                await itemModel.DELETE_USER_PICK_ITEM(user_seq, queryString.items_seq);
                resReturn = {
                    flags: 1,
                    message: '찜 해제되었습니다.'
                }
            } else {
                await itemModel.USER_PICK_ITEM(user_seq, queryString.items_seq);
                resReturn = {
                    flags: 0,
                    message: '찜 등록되었습니다.'
                }
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
