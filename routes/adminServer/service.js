var express = require('express');
var router = express.Router();
var adminModel = require('../../public/javascripts/components/adminModel');

router.get('/', (req, res) => {
    res.status(200).render('iruwa_admin_service');
});

module.exports = router;