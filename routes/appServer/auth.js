var express = require('express');
var router = express.Router();
const multer = require("multer");

var userModel = require('../../public/javascripts/components/userModel');
var functions = require('../../public/javascripts/functions/functions');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/profiles');
        },

        filename: (req, file, cb) => {
            var type = file.mimetype.split('/')
            cb(null, JSON.stringify(Date.now()) + '.' + type[1]);
        }
    })
})

const registration = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/business_registration');
        },

        filename: (req, file, cb) => {
            var type = file.mimetype.split('/')
            cb(null, JSON.stringify(Date.now()) + '.' + type[1]);
        }
    })
})

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
            resReturn = USER_INFO;
            req.session.user = USER_INFO.userSession;
            if (USER_INFO.flags == 0) {
                // GET_USER_ALARM_STATE Function Calls User's Alarm Setting Using USER_SEQ.
                var USER_ALARM_SET = await userModel.GET_USER_ALARM_STATE(USER_INFO.userSession.user_seq);
                USER_INFO.userSession.main_alarm = USER_ALARM_SET.main_alarm;
                USER_INFO.userSession.sub_alarm = USER_ALARM_SET.sub_alarm;
                // IF There is no Company Information, CMP_INFO Will be false.
                // If Not, userSession Will be Updated!
                var CMP_INFO = await userModel.GET_CMP_INFO_ON_USER(USER_INFO);
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

router.post('/register',
    registration.single('image'),
    async (req, res) => {
        // ** 함수는 한 가지 기능만 구현한다!
        // ** 데이터 베이스 호출 속도를 빠르게 한다.
        try {
            console.log('Register Data', req.body);
            var FromData = JSON.parse(req.body.data);
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

router.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(err => {
            console.log('failed: ' + err);
            return;
        });
        console.log('success');
        res.status(200).send(true);
    } else return;
});

router.get('/info', async (req, res) => {
    try {
        res.status(200).send({
            user_seq: req.session.user.user_seq,
            user_name: req.session.user.user_name,
            user_location: req.session.user.user_location,
            cmp_exist: req.session.user.cmp_exist,
            cmp_seq: req.session.user.cmp_seq,
            cmp_name: req.session.user.cmp_name,
            cmp_location: req.session.user.cmp_location,
        });
    } catch (err) {
        console.log(err);
    }
});

router.post('/userlocation', async (req, res) => {
    try {
        var user_location = req.body.user_location;
        var user_seq = req.session.user.user_seq;

        var UPDATE_RESPONSE = await userModel.USER_LOCATION_UPDATE(user_location, user_seq);
        if (UPDATE_RESPONSE) {
            req.session.user.user_location = user_location;
        }
        res.status(200).send(true);
    } catch (err) {
        console.log(err);
    }
});

router.post('/userprofile', async (req, res) => {
    try {
        var user_seq = req.body.user_seq;
        var resReturn = {
            flags: 1,
            message: '정보가 없습니다.'
        }
        var USER_PROFILE = await userModel.GET_USER_PROFILE(user_seq);
        if (USER_PROFILE.length != 0) {
            resReturn = {
                flags: 0,
                message: USER_PROFILE[0].uri
            }
        }
        res.status(200).send(resReturn)
    } catch (err) {
        console.log(err);
    }
})

router.post('/profileimage',
    upload.single('image'),
    async (req, res) => {
        console.log('REQ FILE', req.file);
        try {
            var FromData = new Object();
            var resReturn = {
                flags: 1,
                message: '프로필 업로드에 실패하였습니다.'
            }
            var user_seq = req.session.user.user_seq;
            FromData.user_seq = user_seq;
            var images = req.file;
            // Before Save User Profile Image, Check Whether there are any other Profile Image or Not.
            // If There is Uploaded Image, Delete it.
            var a = await userModel.DELETE_PREV_PROFILE_IMAGE(FromData.user_seq);
            console.log('a', a)

            var SAVE_RESULT = await userModel.SAVE_PROFILE_IMAGE_URI(FromData.user_seq, images);
            if (SAVE_RESULT) {
                var resReturn = {
                    flags: 1,
                    message: '프로필이 변경되었습니다.'
                }
            }
            res.status(200).send(resReturn)
        } catch (err) {
            console.log(err);
        }
    });


module.exports = router;
