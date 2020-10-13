const { Buffer } = require('buffer');
const email_sender = () => {
    var stringToBase64 = new Buffer.from('kshyeon123@gmail.com');
    var s = stringToBase64.toString('base64');
    console.log(s)
}
email_sender();