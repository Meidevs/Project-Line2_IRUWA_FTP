var express = require('express');
var router = express.Router();
var functions = require('../../public/javascripts/functions/functions');
var adminModel = require('../../public/javascripts/components/adminModel');

router.get('/', (req, res) => {
    res.status(200).render('iruwa_admin_login');
});

router.post('/login', async (req, res) => {
    try {
        var FromData = req.body;
        var resReturn;
        FromData.user_id = req.body.user_id;
        FromData.user_pw = req.body.user_pw;
        resReturn = {
            flags: 1,
            message: '아이디를 확인해 주세요.'
        }
        // !! Distinguish General & Incorporated User Based On Status Value Which Sent From Browser. (0 General User, 1 Incorporated User).
        // Notice! Datas From Browser about General User & Incorporated User are totally Different. 
        // Variables of Data ,user_id for General User and cmp_id for Incorp User, are Different.
        //Encrypt User & Incorporated Password For Security. Hash Password Created Using User_id and User_pw.

        // CHECK_USER_EXISTENCE or CHECK_CMP_EXISTENCE is Checking whether User already Exist or Not. 
        // USER_EXISTENCE == 0 Means that user_id(cmp_id) Which you sent to Server is out of Database.
        // Contrarily, USER_EXISTENCE == 1 Means that user_id is in the Database.
        console.log(FromData)
        var adminExitence = await adminModel.CHECK_ADMIN_EXISTENCE(FromData);

        if (adminExitence == 1) {
            var USER_INFO = await adminModel.LOGIN_ADMIN(FromData);
            if (USER_INFO.length > 0) {
                req.session.user.user_id = FromData.user_id;
                resReturn = {
                    flags: 0,
                    message: '로그인 되었습니다.'
                }
            } else {
                resReturn = {
                    flags: 1,
                    message: '비밀번호를 확인해 주세요.'
                }
            }
        }
        res.status(200).send(resReturn);

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;