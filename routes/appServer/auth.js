var express = require('express');
var router = express.Router();

var userModel = require('../../public/javascripts/components/userModel');
var itemModel = require('../../public/javascripts/components/itemModel');
var functions = require('../../public/javascripts/functions/functions');

router.post('/login', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var FromData = req.body;
        console.log(FromData)
        var resReturn;
        var todayString = await functions.TodayString();
        FromData.reg_date = todayString;

        resReturn = {
            flags: 1,
            message: '아이디를 확인해 주세요.'
        }
        // !! Distinguish General & Incorporated User Based On Status Value Which Sent From Browser. (0 General User, 1 Incorporated User).
        // Notice! Datas From Browser about General User & Incorporated User are totally Different. 
        // Variables of Data ,user_id for General User and cmp_id for Incorp User, are Different.

        if (FromData.status == 0) {
            //Encrypt User & Incorporated Password For Security. Hash Password Created Using User_id and User_pw.
            var hashingPassword = await functions.PasswordEncryption(FromData.user_id, FromData.user_pw);
            FromData.user_pw = hashingPassword;

            // CHECK_USER_EXISTENCE or CHECK_CMP_EXISTENCE is Checking whether User already Exist or Not. 
            // USER_EXISTENCE == 0 Means that user_id(cmp_id) Which you sent to Server is out of Database.
            // Contrarily, USER_EXISTENCE == 1 Means that user_id is in the Database.

            var USER_EXISTENCE = await userModel.CHECK_USER_EXISTENCE(FromData);
            if (USER_EXISTENCE == 1) {
                var USER_INFO = await userModel.LOGIN_USER(FromData);
                resReturn = USER_INFO;
                if (USER_INFO.flags == 0) {
                    req.session.user = USER_INFO.userSession;
                    resReturn = USER_INFO;
                }
            }
        } else if (FromData.status == 1) {
            var hashingPassword = await functions.PasswordEncryption(FromData.cmp_id, FromData.cmp_pw);
            FromData.cmp_pw = hashingPassword;

            // Incorporated User ID Check
            var CMP_EXISTENCE = await userModel.CHECK_CMP_EXISTENCE(FromData);
            if (CMP_EXISTENCE == 1) {
                var CMP_INFO = await userModel.LOGIN_CMP(FromData);
                resReturn = CMP_INFO;
                if (CMP_INFO.flags == 0) {
                    req.session.user = CMP_INFO.userSession;
                    resReturn = CMP_INFO;
                }
            }
        } else {
            resReturn = {
                flags: 999,
                messages: '로그인에 실패하였습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err)
    }
});

router.post('/register', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var FromData = req.body;
        var todayString = await functions.TodayString();
        FromData.reg_date = todayString;

        var resReturn = {
            flags: 1,
            message: '이미 가입된 아이디입니다.'
        }

        if (FromData.status == 0) {
            var hashingPassword = await functions.PasswordEncryption(FromData.user_id, FromData.user_pw);
            FromData.user_pw = hashingPassword;

            // Confirm User_ID Existence, 0 Not Exist & 1 Exist
            var USER_EXISTENCE = await userModel.CHECK_USER_EXISTENCE(FromData);
            if (USER_EXISTENCE == 0) {
                var REGISTER_COMPLETE = await userModel.REGISTER_USER(FromData);
                resReturn = REGISTER_COMPLETE;
            }
        } else if (FromData.status == 1) {
            var hashingPassword = await functions.PasswordEncryption(FromData.cmp_id, FromData.cmp_pw);
            FromData.cmp_pw = hashingPassword;

            // Confirm User_ID Existence, 0 Not Exist & 1 Exist
            var CMP_EXISTENCE = await userModel.CHECK_CMP_EXISTENCE(FromData);
            if (CMP_EXISTENCE == 0) {
                var REGISTER_COMPLETE = await userModel.REGISTER_CMP(FromData);
                resReturn = REGISTER_COMPLETE;
            }
        } else {
            resReturn = {
                flags: 999,
                messages: '로그인에 실패하였습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
