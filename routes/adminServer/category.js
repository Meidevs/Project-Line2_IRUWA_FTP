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
            cb(null, req.body.icon_name + '.' + type[1]);
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
            console.log(req.body);
            console.log(req.files);
            var FromData = new Object();
            var resReturn = {
                flags: 1,
                message: '카테고리를 업데이트에 실패하였습니다.'
            }
            FromData.category_name = req.body.category_name;
            FromData.icon_name = req.body.icon_name;
            var result = await adminModel.setCategory(FromData);
            var lastNum = await adminModel.getLastCategoryNum();
            FromData.category_seq = lastNum[0].category_seq;
            if (result) {
                setIconResult = await adminModel.setCategoryIcon(FromData);
                if (setIconResult) {
                    resReturn = {
                        flags: 0,
                        message: '카테고리를 업데이트 하였습니다.'
                    }
                }
            }
            res.status(200).send(resReturn)
        } catch (err) {
            console.log(err);
        }
    });
router.post('/delete', async (req, res) => {
    try {
        var FromData = new Object();
        FromData.category_seq = req.body.category_seq;
        await adminModel.deleteCategory(FromData);
        await adminModel.deleteCategoryIcon(FromData);
        var resReturn = {
            flags : 0,
            message : '삭제되었습니다.'
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/list', async (req, res) => {
    try {
        var resCategories = await adminModel.getCategoryList();
        res.status(200).send(resCategories);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
