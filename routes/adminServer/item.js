var express = require('express'); 
const { route } = require('./auth');
var router = express.Router();

router.get('/main', (req, res) => {
    res.status(200).render('iruwa_admin_main');
});

router.get('/listing', (req, res) => {
    res.status(200).render('iruwa_admin_listing');
});


module.exports = router;