var express = require('express');
var router = express.Router();

var userModel = require('../public/javascripts/components/userModel');
const functions = require('../public/javascripts/functions/functions');
const { resolve } = require('path');

router.post('/auth/login', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var FromData = req.body;
        var resReturn;
        var todayString = await functions.TodayString();
        FromData.reg_date = todayString;

        resReturn = {
            flags : 1,
            message : '아이디를 확인해 주세요.'
        }

        // Distinguish General & Incorporated User Based On Status Value Which Sent From Browser. (0 General User, 1 Incorporated User)
        if (FromData.status = '0') {
            console.log('Status 0')
            //Encrypt User & Incorporated Password For Security. Hash Password Created Using User_id and User_pw.
            var hashingPassword = await functions.PasswordEncryption(FromData.user_id, FromData.user_pw);
            FromData.user_pw = hashingPassword;

            // General User ID Check
            var USER_EXISTENCE = await userModel.CHECK_USER_EXISTENCE(FromData);
            console.log(USER_EXISTENCE)
            if (USER_EXISTENCE == 1) {
                console.log('USER EXIST')
                var USER_INFO = await userModel.LOGIN_USER(FromData);
                resReturn = USER_INFO;
                if (USER_INFO.flags == 0) {
                    console.log('PASSWORD MATCHES')
                    req.user.session = USER_INFO.userSession;
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
                    req.user.session = CMP_INFO.userSession;
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

router.post('/auth/register', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        // user_id, user_pw, user_name, user_phone, user_email, reg_date
        var FromData = req.body;

        var resReturn = {
            flags: 1,
            message: '이미 가입된 아이디입니다.'
        }
        var hashingPassword = await functions.PasswordEncryption(FromData.user_id, FromData.user_pw);
        var todayString = await functions.TodayString();
        FromData.user_pw = hashingPassword;
        FromData.reg_date = todayString;

        // Confirm User_ID Existence, 0 Not Exist & 1 Exist
        var USER_EXISTENCE = await userModel.CHECK_USER_EXISTENCE(FromData);
        if (USER_EXISTENCE == 0) {
            await userModel.REGISTER(FromData);
            resReturn = {
                flags: 0,
                message: '회원가입 되었습니다.'
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
