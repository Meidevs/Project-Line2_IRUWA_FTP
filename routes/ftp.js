var express = require('express');
var router = express.Router();
var multer = require('multer');

var itemModel = require('../public/javascripts/components/itemModel');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images');
        },

        filename: (req, file, cb) => {
            var type = file.mimetype.split('/')
            cb(null, JSON.stringify(Date.now()) + '.' + type[1]);
        }
    })
})

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/image/upload', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body.items_seq)
        console.log(req.file)
        var items_seq = req.body.items_seq;
        var filename = req.file.filename;
        await itemModel.SAVE_IMAGE_URI(filename);
        res.status(200).send(true);
    } catch (err) {
        console.log(err)
    }
});

router.get('/image/load/', async (req, res) => {
    try {
      res.status(200).send('a');
    } catch (err) {
      console.log(err)
    }
  })

module.exports = router;