var express = require('express');
var router = express.Router();
var adminModel = require('../../public/javascripts/components/adminModel');
function errorHandler(res) {
    res.status(500);
    res.send('비정상 접근입니다.');
}
router.get('/main', (req, res) => {
    if (!req.session.user) return errorHandler(res);
    res.status(200).render('iruwa_admin_main');
});

router.get('/images', (req, res) => {
    if (!req.session.user) return errorHandler(res);
    res.status(200).render('iruwa_admin_images');
});

router.get('/popular', async (req, res) => {
    try {
        var result = new Array();
        var rawArray = new Array();
        var newString;
        var resReturn = {
            flags: 1,
            message: '조회에 실패하였습니다.'
        };
        result = await adminModel.getHighestView();
        for (var i = 0; i < result.length; i++) {
            rawArray.push(result[i].items_seq);
        }
        if (rawArray.length - 3 <= 0) {
            newString = rawArray.join();
        } else {
            newString = rawArray.slice(0, 3).join();
        }
        var itemsList = await adminModel.getHighestViewItem(newString);
        var imageList = await adminModel.getImageUri(newString);
        itemsList.map((data) => {
            data['image'] = new Array();
            for (var i = 0; i < imageList.length; i++) {
                if (data.items_seq == imageList[i].items_seq) {
                    data.image.push(imageList[i].uri)
                }
            }
        });
        var cmpList = await adminModel.getCompanyInfo(newString);
        itemsList.map((data) => {
            for (var i = 0; i < cmpList.length; i++) {
                if (data.cmp_seq == cmpList[i].cmp_seq) {
                    data['cmp'] = cmpList[i];
                }
            }
        })
        resReturn = {
            flags: 0,
            message: itemsList,
        }

        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/recentcompany', async (req, res) => {
    try {
        var resReturn = {
            flags: 1,
            message: '조회에 실패하였습니다.'
        };
        var result = await adminModel.getNewCompany();

        resReturn = {
            flags: 1,
            message: result
        };
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/list', (req, res) => {
    if (!req.session.user) return errorHandler(res);
    res.status(200).render('iruwa_admin_list');
});



router.get('/all', async (req, res) => {
    try {
        var companies = await adminModel.getAllCompany();
        res.status(200).send(companies);
    } catch (err) {
        console.log(err);
    }
});

router.post('/renew', async (req, res) => {
    try {
        var FromData = new Object();
        FromData.cmp_seq = req.body.cmp_seq;
        var resReturn = {
            flags: 1,
            message: '업체 광고 등록기간 연장이 실패하였습니다.'
        }
        // Check which condition to execute;
        // Outdated, No data (NULL), Extend Period;
        var now = new Date();
        var getCmpDueDate = new Date();
        var dueDate = new Date();
        var dateNum;
        // Get Company Premium Ads Permission Due Date;
        getCmpDueDate = await adminModel.getCompanyDuedate(FromData);
        if (getCmpDueDate[0].ads_date) {
            dueDate = getCmpDueDate[0].ads_date;
        } else {
            dueDate = null;
        }

        if (dueDate < now | dueDate == null) {
            var dateNum = now.setDate(now.getDate() + 30);
        } else {
            var dateNum = dueDate.setDate(dueDate.getDate() + 30);
        }
        var newDateString = new Date(dateNum).toISOString().substring(0, 10);
        FromData.due_date = newDateString;
        var updateResult = await adminModel.renewDueDate(FromData);
        if (updateResult) {
            resReturn = {
                flags: 0,
                message: '업체의 광고 등록기간이 연장되었습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.post('/setpremium', async (req, res) => {
    try {
        var FromData = new Object();
        FromData.cmp_seq = req.body.cmp_seq;
        var resReturn = {
            flags: 1,
            message: '프리미엄 변경이 실패하였습니다.'
        }

        // Check which condition to execute;
        // Outdated, No data (NULL), Extend Period;
        var now = new Date();
        var getCmpPreDueDate = new Date();
        var preDueDate = new Date();
        var dateNum;
        // Get Company Premium Ads Permission Due Date;
        getCmpPreDueDate = await adminModel.getCompanyPreDuedate(FromData);
        if (getCmpPreDueDate[0].pre_ads_date) {
            preDueDate = getCmpPreDueDate[0].pre_ads_date;
        } else {
            preDueDate = null;
        }

        if (preDueDate < now | preDueDate == null) {
            var dateNum = now.setDate(now.getDate() + 30);
        } else {
            var dateNum = preDueDate.setDate(preDueDate.getDate() + 30);
        }
        var newDateString = new Date(dateNum).toISOString().substring(0, 10);

        FromData.pre_due_date = newDateString;

        var updateResult = await adminModel.changeToPremiums(FromData);
        if (updateResult) {
            resReturn = {
                flags: 0,
                message: '프리미엄으로 등록되었습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.post('/pause', async (req, res) => {
    try {
        var FromData = new Object();
        FromData.cmp_seq = req.body.cmp_seq;
        var resReturn = {
            flags: 1,
            message: '업체 서비스 중지에 실패하였습니다.'
        }
        var result = await adminModel.pauseCompany(FromData);
        if (result) {
            resReturn = {
                flags: 0,
                message: '업체 서비스를 중지합니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
})

router.get('/itemimages', async (req, res) => {
    try {
        var result = await adminModel.getImageInfo();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
    }
});

router.post('/searchcompany', async (req, res) => {
    try {
        var FromData = new Object();
        FromData.category_seq = req.body.category_seq;
        FromData.cmp_name = req.body.cmp_name;
        var resReturn = {
            flags: 1,
            message: '검색 결과가 없습니다.'
        }
        var searchResult = await adminModel.searchCompanyList(FromData);
        if (searchResult.length > 0) {
            resReturn = {
                flags: 0,
                message: searchResult,
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/detail/company', (req, res) => {
    res.status(200).render('iruwa_admin_company');
});

router.get('/detail/item', (req, res) => {
    res.status(200).render('iruwa_admin_detail');

});

router.post('/detail/item', async (req, res) => {
    try {
        console.log('Request Body : ', req.body)
        console.log('Request Body : ', req.query)
        console.log('Request Body : ', req.params)
        var FromData = new Object();
        FromData.cmp_seq = req.body.cmp_seq;
        FromData.items_seq = req.body.items_seq;

        var cmpInfo = await adminModel.getCompany(FromData);
        var itemInfo = await adminModel.getItem(FromData);
        itemInfo['image'] = await adminModel.getImageUri(FromData.items_seq);
        res.status(200).send({cmp : cmpInfo, item : itemInfo});
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;