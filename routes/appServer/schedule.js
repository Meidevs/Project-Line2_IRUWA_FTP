var cron = require('node-cron');
var userMode = require('../../public/javascripts/components/userModel');
var itemMode = require('../../public/javascripts/components/itemModel');
cron.schedule("* * * * *", async () => {
    try {
        var userCouponCnt = await userModel.GET_USER_COUPON();
        var userRecommendationCnt = await userModel.GET_RECOMMENDATIONS();

    } catch (err) {

    }
})

module.exports = cron;