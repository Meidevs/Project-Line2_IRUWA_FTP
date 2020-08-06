var express = require('express');
var router = express.Router();
var multer = require('multer');
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
    res.render('index')
});

router.post('/image/upload', upload.single('image'), async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.file)
        var adsuri = req.body.adsuri;
        var info = req.body.info;
        var uri = 'http://localhost:8080/images/' + req.file.filename;
        res.status(200).redirect('/api');
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