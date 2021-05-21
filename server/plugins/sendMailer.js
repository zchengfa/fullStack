
const nodemailer = require('nodemailer')

const config = require('./mailConfig')

const smtpTransport = nodemailer.createTransport(config)

function sendMail (recipient,subject,content) {
    smtpTransport.sendMail({
        from:config.auth.user,
        to:recipient,
        subject,
        html:content
    }).then(res => {
        console.log(res,'邮件已发送成功')
    }).catch(err => {
        console.log(err,'邮件发送失败')
    })
}

module.exports = sendMail
