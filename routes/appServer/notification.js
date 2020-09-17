var express = require('express');
var router = express.Router();

var adminModel = require('../../public/javascripts/components/adminModel');


router.get('/create', async (req, res) => {
    try {
        var FromData = new Object();
        FromData.title = req.body.title;
        FromData.Content = req.body.content;
        FromData.reg_date = new Date().toISOString().substring(0,10);
        await adminModel.CREATE_NOTIFICATIONS(FromData);
        
    } catch (err) {
        console.log(err);
    }
});

router.get('/list', async (req, res) => {
    try {
        var NOTIFICATIONS = await adminModel.GET_NOTIFICATIONS();
        res.status(200).send(NOTIFICATIONS)
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
