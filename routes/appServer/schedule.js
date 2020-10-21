var cron = require('node-cron');
var userModel = require('../../public/javascripts/components/userModel');
var adminModel = require('../../public/javascripts/components/adminModel');
var itemModel = require('../../public/javascripts/components/itemModel');
cron.schedule("* * * * *", async () => {
    try {
        console.log('Schedule')
        var cReceiverList = new Array();
        var userCouponCnt = await userModel.GET_RECOMMENDATIONS();
        userCouponCnt.map((data) => {
            if (data.cnt >= 5) {
                cReceiverList.push(data);
            }
        });
        console.log('userCouponCnt', userCouponCnt);
        console.log('cReceiverList', cReceiverList);
        var cReceiverCnt = cReceiverList.length;
        var cList = await adminModel.getUnuseCoupon(cReceiverCnt);
        console.log('cList', cList);
        var resArray = new Array();

        if (cReceiverCnt != cList.length) {
            for (var i = 0; i < cList.length; i++) {
                resArray.push({ user_email: cReceiverList[i].recommendation, coupon: cList[i].coupon_uri })
                await userModel.UPDATE_RECOMMENDATIONS(cReceiverList[i].recommendation);
            }
            console.log('B resArray', resArray);

            for (var j = 0; j < cList.length; j++) {
                await userModel.INSERT_COUPON(resArray[j]);
            }

        } else {
            for (var i = 0; i < cReceiverList.length; i++) {
                resArray.push({ user_email: cReceiverList[i].recommendation, coupon: cList[i].coupon_uri })
                await userModel.UPDATE_RECOMMENDATIONS(cReceiverList[i].recommendation);
            }
            console.log('A resArray', resArray);
            for (var j = 0; j < resArray.length; j++) {
                await userModel.INSERT_COUPON(resArray[j]);
            }
        }
        var cArray = new Array();
        cList.map((data) => {
            cArray.push(data.admin_coupon_seq);
        });
        console.log('cArray', cArray);

        if (cList.length > 0) {
            await adminModel.updateUnuseCoupon(cArray);
        }

    } catch (err) {
        console.log(err);
    }
});

module.exports = cron;