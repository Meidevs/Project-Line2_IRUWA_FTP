var express = require('express'); 
const { route } = require('./auth');
var router = express.Router();

router.post('/main', async (req, res) => {
    try {
        console.log(req)

        res.status(200).render('iruwa_admin_main');
    } catch (err) {

    }
});

router.get('/listing', (req, res) => {
    res.status(200).render('iruwa_admin_listing');
});


module.exports = router;