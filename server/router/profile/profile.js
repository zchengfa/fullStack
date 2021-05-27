module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    const connect = require('../../plugins/connectMysql')

    router.post('/userInfo', (req, res) => {
        console.log(JSON.parse(JSON.stringify(req.body)))
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        const connection = connect()

        const selectQuery = `SELECT HEADER_IMAGE FROM USER WHERE ACCOUNT = '${paramsObj.username}'`

        connection.query(selectQuery, (err, result) => {
            if (err) throw err
            else {
                console.log(result)
                if (result[0]['HEADER_IMAGE']) {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'header_image':result[0]['HEADER_IMAGE']})
                }
                else {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'header_image':false})
                }
            }
        })
    })

    app.use('/', router)
}