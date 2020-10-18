var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).render('auth');
});

router.get('/main', (req, res) => {
    res.status(200).render('index');
});

module.exports = router;