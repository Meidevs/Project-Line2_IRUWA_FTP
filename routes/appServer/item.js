var express = require('express');
var router = express.Router();
var multer = require('multer');

var itemModel = require('../../public/javascripts/components/itemModel');
var functions = require('../../public/javascripts/functions/functions');
var userModel = require('../../public/javascripts/components/userModel');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images');
        },

        filename: (req, file, cb) => {
            var type = file.mimetype.split('/')
            cb(null, JSON.stringify(Date.now()) + '.' + type[1]);
        }
    })
})

router.post('/create', upload.array('image', 10), async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        console.log('req.body', req.body)
        console.log('req.files', req.file)
        console.log('req.files', req.files)
        console.log('userSession', req.session.user);
        var cmp_seq = req.session.user.cmp_seq;
        var FromData = req.body;
        var ITEM_SEQ = 999;
        var todayString = await functions.TodayTimeString();
        FromData.cmp_seq = cmp_seq;
        FromData.reg_date = todayString;
        FromData.item_name = req.body.item_name;
        FromData.item_content = req.body.item_content;
        var ITEM_COUNT = await itemModel.GET_CMP_ITEM_COUNT(FromData);
        if (ITEM_COUNT < 4) {
            await itemModel.INSERT_ITEMS(FromData);
            var ITEM_SEQ = await itemModel.GET_ITEMS_SEQ();
            var items_seq = ITEM_SEQ;
            var filename = req.files;
            await itemModel.SAVE_IMAGE_URI(items_seq, filename);
        }
        // api/item/create Endpoint only Insert Text into Database.
        // Image Upload Will be Requested From Browser Again after Application Receive ITEM_SEQ From api/item/create Endpoint.
        res.status(200).send(true);
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
        FromData.location_name = req.body.user_location;

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

        if (IMAGE_URIs.length != 0) {
            var IMAGE_URI_ARRAY = await itemModel.GET_IMAGE_URI(IMAGE_URIs);
        }

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
        var IMAGE_URIs = new Array();
        var PICK_STATUS = false;
        var VIEW_COUNT = 0;

        // GET_VIEW_OWNER Function Find out Whether a User Already Have Viewed an Item.
        // IF the User is on the List, UPDATE_VIEW_COUNT Function isnt Excuted.
        // Finally, GET_VIEW_COUNT Function Calls the Number of User Who Have Viewed the Item.
        var VIEW_OWNER = await itemModel.GET_VIEW_OWNER(user_seq, queryString.items_seq);
        if (VIEW_OWNER == 0 || null) {
            await itemModel.UPDATE_VIEW_COUNT(user_seq, queryString.items_seq);
        }
        VIEW_COUNT = await itemModel.GET_VIEW_COUNT(queryString.items_seq);

        // GET_RESTIME_AVG Function Calls the data Which was Recorded during Chat From Database.
        // IF GET_RESTIME_AVG Function's Response Variable is not undefined, TimeAverageCal Function is Executed.
        var GET_RESTIME_AVG = await userModel.GET_RESTIME_AVG(queryString);
        if (GET_RESTIME_AVG[0] != undefined) {
            TIME_AVG = await functions.TimeAverageCal(GET_RESTIME_AVG);
        }

        // Check Whether Application's User Already Have Picked the Item.
        // If User already Pick the Item, PICK_STATUS Will be true.
        var EXISTENCE = await itemModel.USER_PICK_EXISTENCE(user_seq, queryString.items_seq);
        if (EXISTENCE) {
            PICK_STATUS = true;
        }

        var ITEMS_OF_OWNER = await itemModel.GET_ITEMS_LIST_ON_OWNER(queryString);
        for (var i = 0; i < ITEMS_OF_OWNER.length; i++) {
            ITEMS_OF_OWNER[i].item_content = ITEMS_OF_OWNER[i].item_content.toString();
        }

        // Extract items_seq As a Array. IMAGE_URIs Array sent to GET_IMAGE_URI Function Which Get Image Uris From Database. 
        for (var j = 0; j < ITEMS_OF_OWNER.length; j++) {
            IMAGE_URIs.push(ITEMS_OF_OWNER[j].items_seq);
        }
        var IMAGE_URI_ARRAY = await itemModel.GET_IMAGE_URI(IMAGE_URIs);

        ITEMS_OF_OWNER.map((data) => {
            data.uri = new Array();
            for (var x = 0; x < IMAGE_URI_ARRAY.length; x++) {
                if (data.items_seq == IMAGE_URI_ARRAY[x].items_seq) {
                    data.uri.push(IMAGE_URI_ARRAY[x].uri)
                }
            }
        })

        res.status(200).send({ VIEW_COUNT: VIEW_COUNT, TIME_AVG: TIME_AVG, PICK_STATUS: PICK_STATUS, ITEMS_OF_OWNER: ITEMS_OF_OWNER });
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
