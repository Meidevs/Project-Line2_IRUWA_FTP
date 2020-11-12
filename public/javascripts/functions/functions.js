var crypto = require('crypto');
var btoa = require('btoa');

class Functions {
    PasswordEncryption(id, pw) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    console.log("Password Encryption id", id, "pw", pw)
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

    TodayString() {
        return new Promise(
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
    TodayTimeString() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var today = new Date();
                    resolve(today)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    AddDate(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var currentDate = new Date();
                    var year = currentDate.getFullYear();
                    var month = currentDate.getMonth();
                    var day = currentDate.getDate();
                    var dueDate = new Date(year, month, day + data.coupon_due_date).toISOString().substr(0, 10);
                    resolve(dueDate);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    SearchString(filter, data) {
        return new Promise(
            async (resolve, reject) => {
                try {

                } catch (err) {

                }
            }
        )
    }

    TimeAverageCal(data) {
        return new Promise(
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

                    // Add Each of Date, Hour, Minutes, Seconds Variables.
                    TimeArray.map((data) => {
                        date = date + parseInt(data[0]);
                        hour = hour + parseInt(data[1]);
                        minutes = minutes + parseInt(data[2]);
                        seconds = seconds + parseInt(data[3]);
                    });
                    // One Day = 1 * 24 * 60 * 60 s
                    // One Hour = 1 * 60 * 60 s
                    // One Minute = 1 * 60 s
                    // One Seconds = 1 s
                    var dateToSeconds = date * 24 * 60 * 60;
                    var hourToSeconds = hour * 60 * 60;
                    var minutesToSeconds = minutes * 60;
                    var timeAvg = (dateToSeconds + hourToSeconds + minutesToSeconds + seconds) / TimeArray.length;
                    var result = parseInt(timeAvg / 86400) + ":" + parseInt(timeAvg % 86400 / 3600) + ":" + parseInt(timeAvg % 86400 % 3600 / 60) + ":" + timeAvg % 86400 % 3600 % 60;
                    resolve(result);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    randomArray(dataArray) {
        var rndNumArray = new Array();
        do {
            var rndNum = Math.floor(Math.random() * dataArray.length);
            var existence = rndNumArray.includes(rndNum);
            if (!existence) {
                rndNumArray.push(rndNum);
            }
        } while (rndNumArray.length < 5);
        return rndNumArray;
    }
}


module.exports = new Functions();