var express = require('express'); 
var router = express.Router();

router.get('/listing', (req, res) => {
    res.status(200).render('adlistionglist');
})