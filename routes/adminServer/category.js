var express = require('express');
var router = express.Router();
var adminModel = require('../../public/javascripts/components/adminModel');
const multer = require("multer");
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/icons');
        },

        filename: (req, file, cb) => {
            var type = file.mimetype.split('/')
            cb(null, JSON.stringify(req.body.icon_name) + '.' + type[1]);
        }
    })
});
router.get('/', (req, res) => {
    res.status(200).render('iruwa_admin_categories');
});

router.post('/upload',
    upload.any(),
    async (req, res) => {
        try {
            console.log(req.body)
        } catch (err) {

        }
    });

router.get('/categories', async (req, res) => {
    try {
        var resCategories = await adminModel.getCategoryList();
        res.status(200).send(resCategories);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
