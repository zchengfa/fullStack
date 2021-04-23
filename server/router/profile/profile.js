module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/profile', (req, res) => {
        //连接mysql数据库，查询是否有与参数一致的用户名和密码
        const connection = require('../../plugins/connectMysql')
        const select_query = 'SELECT * FROM USER'

        connection.query(select_query, (err, results) => {
            if (err) throw err
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(results)
        })
    })

    app.use('/home/api', router)
}