var express = require('express'); 
const { route } = require('./auth');
var router = express.Router();

router.get('/listing', (req, res) => {
    res.status(200).render('adlistinglist');
})

module.exports = router;