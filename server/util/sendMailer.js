
const nodemailer = require('nodemailer')

const config = require('./mailConfig')

const {generateVerifyCode} = require('./verifyCode')

const smtpTransport = nodemailer.createTransport(config)

function sendMailVerifyCode (recipient,subject,content) {
    return smtpTransport.sendMail({
        from:config.auth.user,
        to:recipient,
        subject,
        html:content
    })
}

module.exports = {
    sendMailVerifyCode,
    generateVerifyCode
}

