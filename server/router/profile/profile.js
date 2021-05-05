module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.get('/profile', (req, res) => {
        const profileModel = require('../../model/profileModel')
        profileModel.find({}, (err, docs) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            if (err) {
                res.send(err)
            }
            res.send(docs)
        })
    })

    router.post('/login', (req, res) => {
        const params =JSON.stringify(req.body)
        const paramsObj = JSON.parse(params)

        //连接mysql数据库，查询是否有与参数一致的用户名和密码
        const connection = require('../../plugins/connectMysql')
        const select_query = `SELECT * FROM USER WHERE acount = '${paramsObj.username}' AND password = '${paramsObj.pwd}'`

        connection.query(select_query, (err, results) => {
            if (err) console.log(err)
            if (results.length !==0){
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send('success')
            }
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send('failed')
            }
        })

        console.log(paramsObj)
    })

    app.use('/home/api', router)
}