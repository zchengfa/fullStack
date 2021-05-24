module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    const {sendMailVerifyCode,generateVerifyCode} = require('../../util/sendMailer')

    let verifyCode = generateVerifyCode()

    const verifyCodeExpired = 30

    router.post('/verifyMailCode', (req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)

        const html = `<p>这是一条来自mall项目组发送给您的验证邮件，您的验证码为<a href="javascript:(0)" style="color: #f00">${verifyCode}</a>，请在${verifyCodeExpired/60}分钟内使用此验证码，过期无效哦！</p>`

        sendMailVerifyCode(paramsObj.email,'mall用户注册验证邮件',html).then(() => {
            console.log(`邮件已经发送给了${paramsObj.email}`)
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({'verify_code':generateVerifyCode(),'verify_code_expired':verifyCodeExpired})

            //将验证码返回给前端后设置一个定时器，是生成的验证码为空，使其与之前的验证码不一致，实现验证码过期
            setTimeout(() => {
                verifyCode = ''
            },verifyCodeExpired * 1000)
        }).catch(() => {
            console.log(`${paramsObj.email}不存在，无法发送邮箱验证`)
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({'email_non_exist':`${paramsObj.email}邮箱不存在,无法发送邮箱验证`})
        })
    })

    router.post('/register', (req, res) => {
        //将请求参数转换成对象
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)

        //创建数据库查询语句
        const selectQuery = `SELECT * FROM USER WHERE account = '${paramsObj.username}'`
        const selectUserCount = `SELECT COUNT(1) FROM USER`


        const connect = require('../../plugins/connectMysql')

        //连接数据库
        const connection = connect()
        connection.query(selectQuery, (err,result)=> {
            if (err) throw err

            //查询结果不为空，说明已经存在该用户,提示用户该账号已被注册
            if (Object.keys(result).length){
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'exist':'账号已被注册'})
                console.log('账号已被注册')
            }
            else {
                //查询结果为空，账号未被注册，将用户注册的账号等信息写入数据库
                connection.query(selectUserCount, (err,result) => {
                    if (err) throw  err
                    // console.log(result[0]['COUNT(1)'])
                    //创建查询语句，查询该表已有多少条数据，将user_id字段在原有的数据数量上加一
                    const insertQuery = `INSERT INTO USER (user_id,account,password) VALUES ('${result[0]['COUNT(1)'] + 1 }','${paramsObj.username}','${paramsObj.pwd}')`
                    connection.query(insertQuery, (err) => {
                        if (err) throw err
                        res.setHeader('Access-Control-Allow-Origin', '*')
                        res.send({'success':'注册成功'})
                        console.log('注册成功')
                    })
                })

            }

        })

    })

    app.use('/', router)
}