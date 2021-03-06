var express = require('express');
var router = express.Router();

var itemModel = require('../../public/javascripts/components/itemModel');
var functions = require('../../public/javascripts/functions/functions');

router.get('/all', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var ALL_CATEGORIES = await itemModel.SELECT_ALL_CATEGORIES();
        var CATEGORY_IMAGES = await itemModel.SELECT_ALL_CATEGORY_IMAGES();

        ALL_CATEGORIES.map((data) => {
            for (var i = 0; i < CATEGORY_IMAGES.length; i++) {
                if (data.category_seq == CATEGORY_IMAGES[i].category_seq) {
                    data.uri = CATEGORY_IMAGES[i].uri;
                }
            }
        })
        res.status(200).send(ALL_CATEGORIES)
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
