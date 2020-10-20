var express = require('express'); 
var router = express.Router();
var userModel = require('../../public/javascripts/components/adminModel');
var itemModel = require('../../public/javascripts/components/itemModel');
router.get('/main', (req, res) => {
    res.status(200).render('iruwa_admin_main');
});

router.get('item', async(req, res) => {
    try {

    } catch (err) {
        console.log(err);
    }
})

router.get('/listing', (req, res) => {
    res.status(200).render('iruwa_admin_listing');
});


module.exports = router;