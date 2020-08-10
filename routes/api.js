var express = require('express');
var router = express.Router();

var userModel = require('../public/javascripts/components/userModel');

router.get('/auth',async (req, res) => {
    try {
        var ALL_USERS = await userModel.SelectAll();
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
