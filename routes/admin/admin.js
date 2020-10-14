var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('auth');
});

router.get('/confirm', async (req, res) => {
    try {
        console.log('hi')
        console.log(req.body)
        var response = {
            user : {
                status : 0
            }
        }
        res.status(200).send('email.confirm')
    } catch (err) {
        console.log(err)
    }
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
});

module.exports = router;