var cron = require('node-cron');
var userModel = require('../../public/javascripts/components/userModel');
var adminModel = require('../../public/javascripts/components/adminModel');
cron.schedule("* * * * *", async () => {
    try {
        console.log('Run Every Minutes')
        var cReceiverList = new Array();
        var userCouponCnt = await userModel.GET_RECOMMENDATIONS();
        userCouponCnt.map((data) => {
            if (data.cnt >= 5) {
                cReceiverList.push(data);
            }
        });
        var cReceiverCnt = cReceiverList.length;
        var cList = await adminModel.getUnuseCoupon(cReceiverCnt);
        var resArray = new Array();

        if (cReceiverCnt != cList.length) {
            for (var i = 0; i < cList.length; i++) {
                resArray.push({ user_email: cReceiverList[i].recommendation, coupon: cList[i].coupon_uri, due_date : cList[i].due_date })
                await userModel.UPDATE_RECOMMENDATIONS(cReceiverList[i].recommendation);
            }

            for (var j = 0; j < cList.length; j++) {
                await userModel.INSERT_COUPON(resArray[j]);
            }

        } else {
            for (var i = 0; i < cReceiverList.length; i++) {
                resArray.push({ user_email: cReceiverList[i].recommendation, coupon: cList[i].coupon_uri, due_date : cList[i].due_date })
                await userModel.UPDATE_RECOMMENDATIONS(cReceiverList[i].recommendation);
            }
            for (var j = 0; j < resArray.length; j++) {
                await userModel.INSERT_COUPON(resArray[j]);
            }
        }
        var cArray = new Array();
        cList.map((data) => {
            cArray.push(data.admin_coupon_seq);
        });

        if (cList.length > 0) {
            await adminModel.updateUnuseCoupon(cArray);
        }

    } catch (err) {
        console.log(err);
    }
});

cron.schedule("00 00 * * *", async () => {
    try {
        var now = new Date().toISOString().substring(0,10);
        var FromData = new Object();
        FromData.due_date = now;
        console.log('Today ', now);
        // Ads Date Due Date Update;
        await userModel.setAdsOutDated(FromData);


        // Premium Ads Date Due Date Update;
        await userModel.setPreAdsOutDated(FromData);

    } catch (err) {
        console.log(err);
    }
});

module.exports = cron;