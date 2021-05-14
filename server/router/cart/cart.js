module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    //导入token管理模块
    const jwt = require('jsonwebtoken')

    //导入数据库连接模块
    const connect = require('../../plugins/connectMysql')

    //接收前端cart请求，前端需要将用户token传入后端，后端解析token中的用户，查询数据库中对应用户的购物车数据，最后返回给前端
    router.post('/cart',(req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const token = paramsObj.token
        //console.log(paramsObj)

        jwt.verify(token,'user',(err,decode) => {
            //验证前端传过来的token是否合法，是否过期
            if (err) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send(err)
            }
            //token合法且未过期，连接数据库，查询对应用户的购物车数据并返回给前端
            else {
                //连接数据库
                const connection = connect()
                //console.log(decode)

                //先查询到该用户的ID
                const selectUserId = `SELECT USER_ID FROM USER WHERE ACCOUNT = '${decode.username}'`
                connection.query(selectUserId, (err, result) => {
                    if (err) throw err
                    else {
                        //拿到该用户对应的ID
                        const USER_ID = result[0]['USER_ID']
                        //创建查询语句，查询该用户在USER_SHOP表中是否存在商品数据
                        const selectQuery = `SELECT product_id,product_title,product_image,product_price,product_count,isChecked
                                                FROM USER_SHOP WHERE USERS_ID = ${USER_ID}`

                        //查询数据
                        connection.query(selectQuery,(err,result) => {
                            if (err) throw err
                            //console.log(Object.keys(result).length)
                            if (Object.keys(result).length) {
                                //该用户已有商品数据，先进行数据处理再返回给前端
                                //console.log(result)

                                res.setHeader('Access-Control-Allow-Origin', '*')
                                res.send({'user_cart_data':[result,{'user_id':USER_ID}]})
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

    //接收前端更新购物车状态请求(需要前端参数：user_id,product_id,status)(用户ID，产品ID，需要更改的状态)
    router.post('/updateChecked', (req,res) => {
        //接收请求参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)

        //连接数据库
        const connection = connect()

        //创建数据库修改语句
        const updateChecked = `UPDATE USER_SHOP SET ISCHECKED = ${paramsObj.status} WHERE USERS_ID = ${paramsObj.user_id} AND PRODUCT_ID = ${paramsObj.product_id}`

        //执行修改数据库语句
        connection.query(updateChecked, (err) => {
            if (err) throw err
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({'message':'已改变该产品状态'})
            console.log(`ID为：${paramsObj.user_id}的用户下的${paramsObj.product_id}产品状态修改成功`)
        })

    })

    //接收前端更新购物车状态请求(需要前端参数：user_id,product_id,count)(用户ID，产品ID，需要更改的数量)
    router.post('/updateProductCount', (req,res) => {
        //接收请求参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        //console.log(paramsObj)

        //连接数据库
        const connection = connect()

        //创建更新数据库语句
        const updateCount = `UPDATE USER_SHOP SET PRODUCT_COUNT = ${paramsObj.count} WHERE USERS_ID = ${paramsObj.user_id} AND PRODUCT_ID = ${paramsObj.product_id}`

        //执行更新语句
        connection.query(updateCount, (err, result) => {
            if (err) throw err
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({'empty':'商品推荐数据暂无'})
            console.log(`ID为：${paramsObj.user_id}的用户下的${paramsObj.product_id}产品数量+${paramsObj.count}`)
        })
    })

    //接收前端获取商品推荐数据的请求，将数据返回给前端
    router.get('/commonRecommend', (req, res) => {
        const connection = connect()
        const selectQuery = `SELECT * FROM COMMON_RECOMMEND_SHOP`

        connection.query(selectQuery, (err,result) => {
            if (err) throw err
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({"commonRecommend":result})
            }
        })
    })

    //接收前端用户获取商品推荐数据的请求，将数据返回给前端
    router.post('/userRecommend', (req, res) => {
        //接收前端请求参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const token= paramsObj.token

        //验证请求参数里的token是否合法是否过期
        jwt.verify(token,'user',(err,decode) => {
            if (err) throw err
            else {
                const user_id = decode.user_id
                const selectQuery = `SELECT * FROM USER_RECOMMEND_SHOP WHERE USERS_ID = ${user_id}`

                const connection = connect()

                connection.query(selectQuery,(err,result) => {
                    if (err) throw err
                    else {
                        if (Object.keys(result).length) {
                            res.setHeader('Access-Control-Allow-Origin', '*')
                            res.send({'result':result})
                        }
                        //该用户没有推荐数据，返回默认的推荐数据
                        else {
                            //创建查询默认推荐数据语句
                            const selectDefault = `SELECT * FROM COMMON_RECOMMEND_SHOP`
                            connection.query(selectDefault,(err,result) => {
                                if (err) throw err
                                else {
                                    res.setHeader('Access-Control-Allow-Origin', '*')
                                    res.send({'result':result,'empty':'该用户暂时还没有推荐数据，返回的是默认推荐数据'})
                                }
                            })
                        }
                    }
                })
            }
        })

    })

    app.use('/home/api',router)
}