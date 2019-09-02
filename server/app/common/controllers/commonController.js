const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');


function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, secretKey);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
function decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, secretKey);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
class commonController {
    handleValidation(err) {
        const messages = []
        for (let field in err.errors) { return err.errors[field].message; }
        return messages;
    }
    authTokenGenerate(userId) {
        return jwt.sign({ username: userId },
            'someSecretText'
        );
    }
    async generateHashEmail(email) {
        const hash = await encrypt(email);
        return hash;
    }
    async compareHashEmail(email) {
        const decryptedEmail = await decrypt(email);
        return decryptedEmail;
    }
    sendMail(email, _id, token, cb) {

        var html, subject
        if (_id == undefined || token == undefined) {
            subject = 'Account Activation'
            html = `<p> Dear ${email} Your Account is activated.Your password for future reference will be <b>${token}</b>.<br> Thank you</p>`
        }
        else {
            subject = 'Request for Change Password'
            html = `<p><a href='http://localhost:8004/charity/user/forgetpassword/?token=${token}&user=${_id}'>click here to change password</a></p>`

        }

        // console.log(email, _id, token, html);
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'pk1605199432@gmail.com',
                pass: 'lovemapa!23'
            }
        };
        const transporter = nodemailer.createTransport(smtpConfig);
        const mailOptions = {
            from: 'pk1605199432@gmail.com', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('email sending failed ' + error);
                cb({ status: 0, message: error })
            }
            else {
                cb({ status: 1, message: info })

            }
            transporter.close();
        });
    }
    sendVerification(email, id, type) {
        var transport = nodemailer.createTransport("SMTP", {
            service: 'Gmail',
            auth: {
                user: "naman@apptunix.com",
                pass: "Tunix@5494"
            }
        });
        // Setup mail configuration
        var mailOptions = {
            from: 'noreply@intellistick.com', // sender address
            to: email, // list of receivers
            subject: 'Verify Email', // Subject line
            html: '<br>Hello<br><a href="https://google.com">Click here to verify your email Id</a>' // html body
        };
        // send mail
        transport.sendMail(mailOptions, function (error, info) {
            if (error) { console.log('email sending failed ' + error); }
            else { console.log('Message %s sent: %s', info.messageId, info.response); }
            transport.close();
        });
    }

}

module.exports = new commonController()