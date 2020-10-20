const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var express = require('express'); 
var router = express.Router();
var adminModel = require('../../public/javascripts/components/adminModel');

router.get('/main', (req, res) => {
    res.status(200).render('iruwa_admin_main');
});

router.get('/popular', async(req, res) => {
    try {
        var result = new Array();
        var rawArray = new Array();
        var newString;
        var resReturn = {
            flags : 1,
            message : '조회에 실패하였습니다.'
        };
        result = await adminModel.getHighestView();
        if(result.length > 0) {
            for (var i =0; i< result.length ;i++) {
                rawArray.push(result[i].items_seq);
             }
            if (rawArray.length - 3 < 0) {
                newString = rawArray.join();
            } else {
                newString = rawArray.slice(0,3).join();
            }
            var itemsList = await adminModel.getHighestViewItem(newString);
            var cmpList = await adminModel.getCompanyInfo(newString);

            itemsList.map((data) => {
                for (var i = 0; i < cmpList.length; i++) {
                    if (data.cmp_seq == cmpList[i].cmp_seq) {
                        data['cmp'] = cmpList[i];
                    }
                }
            })
            resReturn = {
                flags : 0,
                message : itemsList,
            }
        }

        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/recentcompany', async(req, res) => {
    try {
        var resReturn = {
            flags : 1,
            message : '조회에 실패하였습니다.'
        };
        var result = await adminModel.getNewCompany();
        if (result.length > 0) {
            resReturn = {
                flags : 1,
                message : result
            };
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err);
    }
});

router.get('/list', (req, res) => {
    res.status(200).render('iruwa_admin_list');
});

router.get('/categories', async (req, res) => {
    try {
        var categoryList = await adminModel.getCategoryList();
        var cmpCount = await adminModel.getItemCount();
        for (var i = 0; i < categoryList.length; i++) {
            categoryList[i].count = 0;
            for (var j = 0; j < cmpCount.length; j++) {
                if (categoryList[i].category_seq == cmpCount[j].category_seq) {
                    if(cmpCount[j].cnt) {
                        categoryList[i].count = cmpCount[j].cnt;
                    } 
                }
            }
        }
        res.status(200).send(categoryList)
    } catch (err) {
        console.log(err);
    }
})


module.exports = router;