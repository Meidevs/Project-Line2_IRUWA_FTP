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
        for (var i = 0; i < cReceiverList.length; i++) {
            await userModel.UPDATE_RECOMMENDATIONS(cReceiverList[i].recommendation);
        }
        // var cReceiverCnt = cReceiverList.length;
        // var cList = await adminModel.getUnuseCoupon(cReceiverCnt);
        // var cArray = new Array();
        // cList.map((data) => {
        //     cArray.push(data.admin_coupon_seq);
        // });
        // await adminModel.updateUnuseCoupon(cArray)
        // await userModel.INSERT_COUPON();

    } catch (err) {
        console.log(err);
    }
});

module.exports = cron;