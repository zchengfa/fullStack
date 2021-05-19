module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/addShopToCart', (req, res) => {
        //导入jsonwebtoken
        const jwt = require('jsonwebtoken')

        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const token = paramsObj.token
        console.log(paramsObj)
        //验证前端传过来的token是否合法，是否过期
        jwt.verify(token,'user', (err,decode) => {
            //身份不合法或已过期
            if (err){
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'err':err})
            }
            //身份合法且未过期
            else {
                //连接数据库
                const connect = require('../../plugins/connectMysql')
                const connection = connect()

                //创建查询语句获得该用户的ID
                const selectUserId = `SELECT USER_ID FROM USER WHERE ACCOUNT = '${decode.username}'`

                //执行查询语句
                connection.query(selectUserId, (err, result) => {
                    if (err) throw err
                    else {
                        //得到用户的USER_ID
                        const USER_ID = result[0]['USER_ID']

                        /*
                        * 添加商品前先判断user_shop表中该用户的商品ID是否已经存在，若已存在表示之前已添加该商品，
                        * 只需要将商品数量在之前数量的基础上增加用户再次添加的商品数量即可。
                        */
                        //创建查询该用户下的对应的商品ID以及商品数量语句
                        const selectProductId = `SELECT PRODUCT_ID,PRODUCT_COUNT FROM USER_SHOP WHERE USERS_ID = ${USER_ID} AND PRODUCT_ID = '${paramsObj.product_id}'`
                        connection.query(selectProductId, (err, result) => {
                            if (err) throw err
                            //console.log(result)
                            //如果result不为空，说明当前用户已添加过该商品，只要增加该商品的数量即可
                            if (Object.keys(result).length) {
                                //创建修改商品数据语句
                                const updateShop = `UPDATE USER_SHOP SET PRODUCT_COUNT = ${result[0]['PRODUCT_COUNT'] + parseInt(paramsObj.count)} WHERE PRODUCT_ID = '${result[0]['PRODUCT_ID']}'`

                                //执行修改商品数据语句
                                connection.query(updateShop, (err, result) => {
                                    if (err) throw err
                                    else {
                                        //修改成功，将添加的数量反馈给前端
                                        res.setHeader('Access-Control-Allow-Origin', '*')
                                        res.send({'message':`数量+${paramsObj.count}`})
                                        console.log(`用户：${decode.username}下已经存在该商品，已将用户：${decode.username}对应的商品数量+${paramsObj.count}`)
                                    }
                                    //console.log(result)

                                })
                            }
                            //查询结果为空，说明该用户未添加该商品，将商品数据添加到数据库中
                            else {
                                //创建添加商品数据到user_shop表语句
                                const insertShop = `INSERT INTO USER_SHOP (USERS_ID,PRODUCT_ID,PRODUCT_TITLE,PRODUCT_IMAGE,PRODUCT_PRICE,PRODUCT_COUNT)
                                                    VALUES (${USER_ID},'${paramsObj.product_id}','${paramsObj.title}','${paramsObj.image}',
                                                            '${paramsObj.price}','${parseInt(paramsObj.count)}')`

                                //执行添加商品数据语句
                                connection.query(insertShop, (err, result) => {
                                    if (err) throw err
                                    else {
                                        //商品添加成功，将结果反馈给前端
                                        res.setHeader('Access-Control-Allow-Origin', '*')
                                        res.send({'message':'添加商品成功'})
                                        console.log(`用户：${decode.username}未曾添加过该商品，已将该商品数据添加到用户：${decode.username}下`)
                                    }

                                })
                            }
                        })
                    }

                })

            }

        })

    })

    app.use('/',router)
}