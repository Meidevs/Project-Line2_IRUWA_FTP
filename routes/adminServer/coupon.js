var express = require('express');
var router = express.Router();
var adminModel = require('../../public/javascripts/components/adminModel');
const path = require('path');
const fs = require('fs');
const directoryPath = path.join("../public/coupons");
router.post('/upload', async (req, res) => {
    try {
        console.log(directoryPath);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;