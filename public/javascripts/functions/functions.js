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
}


module.exports = new Functions();