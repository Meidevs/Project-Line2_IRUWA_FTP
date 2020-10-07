const { Buffer } = require('buffer');
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');

// The credentials for the email account you want to send mail from. 
// Getting Nodemailer all setup with the credentials for when the 'sendEmail()'
// function is called.
class EmailSender {
    email_sender(user_email) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var transporter = nodemailer.createTransport(
                        smtpTransport({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: 'meipartnersdev@gmail.com',
                                pass: 'Mei2020##'
                            }
                        })
                    );
                    // The from and to addresses for the email that is about to be sent.
                    // Combining the content and contacts into a single object that can
                    // be passed to Nodemailer.
                    var stringToBase64 = new Buffer.from(user_email);
                    var s = stringToBase64.toString('base64');
                    console.log('s', s)
                    await transporter.sendMail({
                        from: 'meipartnersdev@gmail.com', // sender address
                        to: user_email, // list of receivers
                        subject: "IRUWA 이메일 인증", // Subject line
                        html: `
                            <body>
                                <h3>IRUWA 회원가입을 축하합니다.</h3>
                                <br>
                                    <div>아래 버튼을 클릭하시면 메일 인증이 완료됩니다.</div>
                                <br>
                                <div>
                                    <a href="http://192.168.0.40:8888/api/auth/emailconfirm?string=`+ s + `" type='button'  style='display: block; width: 400px;border: none;background-color: #15BAC1; color: white; padding: 14px 28px;font-size: 16px;text-align: center;' class='block'>이메일 인증</a>
                                </div>
                            </body>`, // html body
                    });
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )

    }
}



// exporting an 'async' function here allows 'await' to be used
// as the return value of this function.
module.exports = new EmailSender();
