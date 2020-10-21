var cron = require('node-cron');
var userModel = require('../../public/javascripts/components/userModel');
var itemModel = require('../../public/javascripts/components/itemModel');
cron.schedule("1 * * * *", async () => {
    try {
        console.log('Schedule')
        var userCouponCnt = await userModel.GET_RECOMMENDATIONS();
        console.log(userCouponCnt);
        var userRecommendationCnt = await userModel.GET_USER_COUPON();

    } catch (err) {

    }
});

module.exports = cron;