var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    console.log('a')
    res.render('chat');
});

module.exports = router;
