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