module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    const ID = require('../../util/generateID')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    const {sendMailVerifyCode,generateVerifyCode} = require('../../util/sendMailer')

    //用于存储验证码
    let verifyCode = ''

    //验证码过期时间（秒）
    let verifyCodeExpired = 180

    //用于存储邮箱的接受者
    let userEmail = ''


    router.post('/verifyMailCode', (req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)
        //生成验证码
        verifyCode = generateVerifyCode()

        verifyCodeExpired = 180
        //存储验证码接收者
        userEmail = paramsObj.email
        const html = `<p>这是一条来自mall项目组发送给您的验证邮件，您的验证码为<a href="javascript:(0)" style="color: #f00">${verifyCode}</a>，请在${verifyCodeExpired/60}分钟内使用此验证码，过期无效哦！</p>`

        sendMailVerifyCode(paramsObj.email,'mall用户注册验证邮件',html).then(() => {
            console.log(`邮件已经发送给了${paramsObj.email}`)
            res.send({'verify_code_expired':verifyCodeExpired})

            //将验证码返回给前端后设置一个定时器,过期时间为0,实现验证码过期
            setTimeout(() => {
                //过期时间清零
                verifyCodeExpired = 0

            },verifyCodeExpired * 1000)
        }).catch(() => {
            //验证码接收者不存在，清除当前接收者
            userEmail = ''
            console.log(`${paramsObj.email}不存在，无法发送邮箱验证`)
            res.send({'email_non_exist':`${paramsObj.email}邮箱不存在,无法发送邮箱验证`})
        })
    })

    router.post('/register', (req, res) => {

        //将请求参数转换成对象
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        //console.log(verifyCode,verifyCodeExpired,paramsObj.verifyCode)
        console.log(paramsObj)
        function registerUser () {
            const connect = require('../../plugins/connectMysql')
            const mysql_query = require('../../plugins/mysql_query')

            //创建数据库查询语句
            const selectQuery = mysql_query.selectAll('mall_user',`account = '${paramsObj.account}'`)
            const selectUserCount = mysql_query.selectCount('mall_user')

            //连接数据库
            const connection = connect()

            connection.query(selectQuery, (err,result)=> {
                if (err) throw err

                //查询结果不为空，说明已经存在该用户,提示用户该账号已被注册
                if (Object.keys(result).length){
                    res.send({'exist':'账号已被注册'})
                    console.log('账号已被注册')
                }
                else {
                    //查询结果为空，账号未被注册，将用户注册的账号等信息写入数据库
                    connection.query(selectUserCount, (err,result) => {
                        if (err) throw  err

                        //导入时间格式化方法，用于将当前时间作为注册时间
                        const {timeFormatting} = require('../../util/timeFormatting')

                        //创建查询语句，查询该表已有多少条数据，将user_id字段在原有的数据数量上加一
                        const insertQuery = mysql_query.insert('mall_user','id,user_id,account,password,register_time',
                            `${result[0]['COUNT(1)'] + 1 },${ID()},'${paramsObj.account}','${paramsObj.pwd}',
                            '${timeFormatting('YYYY-MM-DD HH:MM:SS')}'`)
                        connection.query(insertQuery, (err) => {
                            if (err) throw err
                            res.send({'success':'注册成功'})
                            console.log('注册成功')
                        })
                    })

                }

            })
        }

        //判断用户传过来的验证码是否合法，不合法则是手机注册，反之则为邮箱注册
        if (paramsObj.verifyCode) {
            //判断用户传过来的验证码是否与之前给该用户发送的验证码一致,且验证码是否过期，若一致则执行注册等操作
            if (paramsObj.account === userEmail && verifyCode === paramsObj.verifyCode && verifyCodeExpired !== 0) {
                registerUser()
            }
            else if (paramsObj.account === userEmail && verifyCode === paramsObj.verifyCode && verifyCodeExpired === 0) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'code_expired':'验证码已过期,注册失败'})
                console.log('验证码已过期,注册失败')
            }
            else {
                res.send({'code_err':'验证码不正确,注册失败'})
                console.log('验证码不正确,注册失败')
            }
        }
        else {
            registerUser()
        }


    })

    router.post('/termsService',(req,res)=>{
        const termsServiceModel = require('../../model/termsServiceModel')
        termsServiceModel.find({},(err,doc)=>{
            if (err) throw err
            else{
                console.log(doc[0])
                if (Object.keys(doc).length){
                    res.send(doc[0])
                }
            }
        })
    })

    app.use('/', router)
}