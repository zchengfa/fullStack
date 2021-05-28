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
        console.log(paramsObj)

        const connection = connect()

        const selectQuery = `SELECT HEADER_IMAGE FROM USER WHERE ACCOUNT = '${paramsObj.username}'`
        const selectQuery2 = `SELECT COUNT(1) FROM USER_COLLECTION WHERE USERS_ID = '${paramsObj.user_id}'`

        connection.query(`${selectQuery +';' +selectQuery2}`, (err, results) => {
            if (err) throw err
            else {
                console.log(results[0][0]['HEADER_IMAGE'])
                if (results[0][0]['HEADER_IMAGE']) {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({
                        'header_image':results[0]['HEADER_IMAGE'],
                        'shop_collection_count':results[1][0]['COUNT(1)']
                    })
                }
                else {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'header_image':false,
                        'shop_collection_count':results[1][0]['COUNT(1)']
                    })
                }
            }
        })
    })

    app.use('/', router)
}