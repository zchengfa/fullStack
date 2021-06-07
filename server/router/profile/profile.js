module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    const connect = require('../../plugins/connectMysql')
    const mysql_query = require('../../plugins/mysql_query')

    router.post('/userInfo', (req, res) => {
        console.log(JSON.parse(JSON.stringify(req.body)))
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj,1)

        const connection = connect()

        const selectQuery = mysql_query.selectFields('user','header_image',`account = '${paramsObj.username}'`)
        const selectQuery2 = mysql_query.selectCount('user_collection', `users_id = '${paramsObj.user_id}'`)
        const selectQuery3 = mysql_query.selectCount('user_brand_collection', `users_id = '${paramsObj.user_id}'`)
        const selectQuery4 = mysql_query.selectCount('user_recommend_shop', `users_id = '${paramsObj.user_id}'`)

        connection.query(`${selectQuery +';' +selectQuery2 + ';' +selectQuery3 + ';' +selectQuery4}`, (err, results) => {
            if (err) throw err
            else {
                console.log(results)
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({
                    'header_image':results[0][0]['HEADER_IMAGE'],
                    'content': {
                        'shop_collection':{
                            'title':'商品收藏',
                            'count':results[1][0]['COUNT(1)']
                        },
                        'brand_collection':{
                            'title':'品牌收藏',
                            'count':results[2][0]['COUNT(1)']
                        },
                        'history':{
                            'title':'我的足迹',
                            'count':results[3][0]['COUNT(1)']
                        }
                    }
                })
            }
        })
    })

    app.use('/', router)
}
