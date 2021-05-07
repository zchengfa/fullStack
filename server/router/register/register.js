module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/register', (req, res) => {
        //将请求参数转换成对象
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)

        //创建数据库查询语句
        const selectQuery = `SELECT * FROM USER WHERE account = '${paramsObj.username}'`
        const insertQuery = `INSERT INTO USER (account,password) VALUES ('${paramsObj.username}','${paramsObj.pwd}')`

        const connect = require('../../plugins/connectMysql')

        //连接数据库
        const connection = connect()
        connection.query(selectQuery, (err,result)=> {
            if (err) throw err
            if (Object.keys(result).length){
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'err':'用户已存在'})
                console.log('用户已存在')
            }
            else {

                connection.query(insertQuery, (err) => {
                    if (err) throw err
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'success':'注册成功'})
                    console.log('注册成功')
                })
            }

        })

    })

    app.use('/', router)
}