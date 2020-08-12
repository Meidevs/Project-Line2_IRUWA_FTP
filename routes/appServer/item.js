var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var functions = require('../../public/javascripts/functions/functions');
var userModel = require('../../public/javascripts/components/userModel');

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

        // api/item/create Endpoint only Insert Text into Database.
        // Image Upload Will be Requested From Browser Again after Application Receive ITEM_SEQ From api/item/create Endpoint.
        res.status(200).send({item_seq : ITEM_SEQ});
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
        FromData.location_name = '서울특별시 구로구 구로3';

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
        res.status(200).send({resReturn : GET_ITEM_LIST});
    } catch (err) {
        console.log(err)
    }  
});

router.post('/list/detail/', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        req.query.item_seq = parseInt(req.query.item_seq);
        req.query.cmp_seq = parseInt(req.query.cmp_seq);
        var queryString = req.query;
        console.log(queryString)

        // Get Company Response Time Avg.
        var GET_RESTIME_AVG = await userModel.GET_RESTIME_AVG(queryString);
        await functions.TimeAverageCal(GET_RESTIME_AVG);
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;
