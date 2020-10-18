var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('iruwa_admin_login');
});

module.exports = router;