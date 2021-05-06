module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/login', (req, res) => {
        const params =JSON.stringify(req.body)
        const paramsObj = JSON.parse(params)

        //连接mysql数据库，查询是否有与参数一致的用户名和密码
        const connect = require('../../plugins/connectMysql')
        const select_query = `SELECT * FROM USER WHERE account = '${paramsObj.username}' AND password = '${paramsObj.pwd}'`

        //连接数据库
        const connection = connect()

        //数据库查询
        connection.query(select_query, (err, results) => {
            if (err) console.log(err)

            //判断是否已有匹配项，有匹配项即账号密码正确，允许登录，生成token并发送给前端
            if (Object.keys(results).length !==0) {
                const jwt = require('jsonwebtoken')
                const user = {
                    username:results[0].account
                }
                //生成token
                const token = jwt.sign(user,'user',{expiresIn: 180})
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'token':token})

                //将生成的token存入数据库中
                const update = `UPDATE USER SET token = '${token}' WHERE account = '${results[0].account}'`
                connection.query(update, (err, results) => {
                    if (err) throw err
                    console.log(results)
                })

                console.log('success')
            }
            //没有匹配项，不允许登录，并将错误信息发送给前端让其提示用户
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'err':'账号或密码错误'})
                console.log('failed')
            }

        })

        console.log(paramsObj)
    })

    app.use('/', router)
}