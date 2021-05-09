module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    const jwt = require('jsonwebtoken')

    //接收前端cart请求，前端需要将用户token传入后端，后端解析token中的用户，查询数据库中对应用户的购物车数据，最后返回给前端
    router.post('/cart',(req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const token = paramsObj.token
        console.log(paramsObj)

        jwt.verify(token,'user',(err,decode) => {
            //验证前端传过来的token是否合法，是否过期
            if (err) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send(err)
            }
            //token合法且未过期，连接数据库，查询对应用户的购物车数据并返回给前端
            else {
                //连接数据库
                const connect = require('../../plugins/connectMysql')
                const connection = connect()
                console.log(decode)

                //先查询到该用户的ID
                const selectUserId = `SELECT USER_ID FROM USER WHERE ACCOUNT = '${decode.username}'`
                connection.query(selectUserId, (err, result) => {
                    if (err) throw err
                    else {
                        //拿到该用户对应的ID
                        const USER_ID = result[0]['USER_ID']
                        //创建查询语句，查询该用户在USER_SHOP表中是否存在商品数据
                        const selectQuery = `SELECT product_id,product_title,product_image,product_price,product_count
                                                FROM USER_SHOP WHERE USERS_ID = ${USER_ID}`

                        //查询数据
                        connection.query(selectQuery,(err,result) => {
                            if (err) throw err
                            console.log(Object.keys(result).length)
                            if (Object.keys(result).length) {
                                //该用户已有商品数据，先进性数据处理在返回给前端
                                console.log(result)

                                res.setHeader('Access-Control-Allow-Origin', '*')
                                res.send({'user_cart_data':result})
                                //console.log(result[0])
                            }
                            else {
                                res.setHeader('Access-Control-Allow-Origin', '*')
                                res.send({'empty':'您的购物车空空如也...'})
                            }
                        })
                    }
                })
            }
        })
    })

    //接收前端获取商品推荐数据的请求，将数据返回给前端
    router.get('/recommend', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send({'empty':'商品推荐数据暂无'})
    })

    app.use('/home/api',router)
}