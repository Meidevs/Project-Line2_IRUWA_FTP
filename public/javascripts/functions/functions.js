var crypto = require('crypto');
var btoa = require('btoa');

class Functions {
    PasswordEncryption(id, pw) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var cryptoHash = crypto.createHash('sha256').update(id).update(pw).digest();
                    var base64String = await btoa(String.fromCharCode(...new Uint8Array(cryptoHash)));
                    resolve(base64String);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    EleminateMarks(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    // Function Call,
                    // "str" is transfered Vaiable, "regExp" is Sort of Marks
                    // Check wheter there are marks or not using test Function. And Replace marks to "".
                    var str = data;
                    var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"\s+]/gi;
                    if (regExp.test(str)) {
                        var reStr = str.replace(regExp, "");
                        // var reStr = result.replace(/\s+/g, '');
                    } else {
                        var reStr = str;
                    }
                    resolve(reStr)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    TodayString () {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var today = new Date();
                    var yearString = today.getFullYear();
                    var monthString = today.getMonth() + 1;
                    var dayString = today.getDate();
                    var dateString = yearString + '-' + monthString + '-' + dayString;
                    resolve(dateString)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    SearchString (filter, data) {
        return new Promise (
            async (resolve, reject) => {
                try {

                } catch (err) {

                }
            }
        )
    }
    TimeAverageCal (data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var TimeArray = new Array();
                    data.map((data) => {
                        var rawData = data.res_time.split(':');
                        TimeArray.push(rawData)
                    });
                    var date = 0;
                    var hour = 0;
                    var minutes = 0;
                    var seconds = 0;

                    TimeArray.map((data) => {
                        date = date + parseInt(data[0]);
                        hour = hour + parseInt(data[1]);
                        minutes = minutes + parseInt(data[2]);
                        seconds = seconds + parseInt(data[3]);
                    });
                    
                } catch (err) {

                }
            }
        )
    }
}


module.exports = new Functions();