var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('auth');
});
router.post('/confirm', async (req, res) => {
    try {
        console.log(req.body)
        var response = {
            user : {
                status : 0
            }
        }
        res.status(200).send(response)
    } catch (err) {
        console.log(err)
    }
});
module.exports = router;
