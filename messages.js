const { Expo } = require('expo-server-sdk');
const userModel = require('./public/javascripts/components/userModel');

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo();
const sendPushNotification = async (data) => {
  var FromData = new Object();
  FromData.user_seq = data.receiver_seq;
  var messages = [];
  var pushToken = await userModel.GET_USER_DEVICE(FromData);
  if (pushToken.length > 0) {
    for (var  i = 0;  i < pushToken.length; i++) {
      if (pushToken[i].appstate == 'background') {
        messages.push({
          to: pushToken[i].token,
          title: '채팅 알림',
          body: data.message,
        });
      }
    }
    await expo.sendPushNotificationsAsync(messages);
  }
}

module.exports = { sendPushNotification };