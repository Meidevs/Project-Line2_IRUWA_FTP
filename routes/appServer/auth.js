var express = require('express');
var router = express.Router();

var userModel = require('../../public/javascripts/components/userModel');
var functions = require('../../public/javascripts/functions/functions');

router.post('/login', async (req, res) => {
    // ** 함수는 한 가지 기능만 구현한다!
    // ** 데이터 베이스 호출 속도를 빠르게 한다.
    try {
        var FromData = req.body;
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
        //Encrypt User & Incorporated Password For Security. Hash Password Created Using User_id and User_pw.
        var hashingPassword = await functions.PasswordEncryption(FromData.user_id, FromData.user_pw);
        FromData.user_pw = hashingPassword;

        // CHECK_USER_EXISTENCE or CHECK_CMP_EXISTENCE is Checking whether User already Exist or Not. 
        // USER_EXISTENCE == 0 Means that user_id(cmp_id) Which you sent to Server is out of Database.
        // Contrarily, USER_EXISTENCE == 1 Means that user_id is in the Database.
        var USER_EXISTENCE = await userModel.CHECK_USER_EXISTENCE(FromData);
        if (USER_EXISTENCE == 1) {
            var USER_INFO = await userModel.LOGIN_USER(FromData);

            // GET_USER_ALARM_STATE Function Calls User's Alarm Setting Using USER_SEQ.
            var USER_ALARM_SET = await userModel.GET_USER_ALARM_STATE(USER_INFO.userSession.user_seq);
            console.log(USER_ALARM_SET)
            USER_INFO.userSession.main_alarm = USER_ALARM_SET.main_alarm;
            USER_INFO.userSession.sub_alarm = USER_ALARM_SET.sub_alarm;
            resReturn = USER_INFO;
            if (USER_INFO.flags == 0) {
                // IF There is no Company Information, CMP_INFO Will be false.
                // If Not, userSession Will be Updated!
                var CMP_INFO = await userModel.GET_CMP_INFO(USER_INFO);
                if (CMP_INFO) {
                    resReturn = CMP_INFO;
                    req.session.user = CMP_INFO.userSession;
                } 
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
        var hashingPassword = await functions.PasswordEncryption(FromData.user_id, FromData.user_pw);
        FromData.user_pw = hashingPassword;

        // Confirm User_ID Existence, 0 Not Exist & 1 Exist
        var USER_EXISTENCE = await userModel.CHECK_USER_EXISTENCE(FromData);
        if (USER_EXISTENCE == 0) {
            var REGISTER_USER = await userModel.REGISTER_USER(FromData);
            var GET_USER_COUNT = await userModel.GET_USER_COUNT();
            await userModel.REGISTER_USER_ALARM(GET_USER_COUNT);
            resReturn = REGISTER_USER;
            if (FromData.status == 1) {
                var REGISTER_CMP = await userModel.REGISTER_CMP(GET_USER_COUNT, FromData);
                resReturn = REGISTER_CMP;
            }
        }
        res.status(200).send(resReturn);
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
