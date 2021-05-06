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
        const connection = require('../../plugins/connectMysql')
        const select_query = `SELECT * FROM USER WHERE acount = '${paramsObj.username}' AND password = '${paramsObj.pwd}'`

        connection.query(select_query, (err, results) => {
            if (err) console.log(err)
            if (Object.keys(results).length !==0) {
                const jwt = require('jsonwebtoken')
                const user = {
                    username:results[0].acount,
                    pwd:results[0].password
                }
                const token = jwt.sign(user,'user',{expiresIn: 180})
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'token':token})
                console.log('success')
            }
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