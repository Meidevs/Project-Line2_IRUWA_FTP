var cron = require('node-cron');

cron.schedule("* * * * *", async () => {
    try {
        console.log('1')
    } catch (err) {

    }
})

module.exports = cron;