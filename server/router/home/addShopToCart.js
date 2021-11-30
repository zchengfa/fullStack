module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/addShopToCart', (req, res) => {

        const paramsObj = JSON.parse(JSON.stringify(req.body))
        //连接数据库
        const connection = require('../../plugins/connectMysql')()
        const mysql_query = require('../../plugins/mysql_query')
        /*
               * 添加商品前先判断user_shop表中该用户的商品ID是否已经存在，若已存在表示之前已添加该商品，
               * 只需要将商品数量在之前数量的基础上增加用户再次添加的商品数量即可。
               */
        //创建查询该用户下的对应的商品ID以及商品数量语句
        const selectProductId = mysql_query.selectFields('user_shop','product_id,product_count',`users_id = '${paramsObj.user_id}' AND product_id = '${paramsObj.product_id}'`)

        connection.query(selectProductId, (err, result) => {
            if (err) throw err
            //console.log(result)
            //如果result不为空，说明当前用户已添加过该商品，只要增加该商品的数量即可
            if (Object.keys(result).length) {
                //创建修改商品数据语句
                const updateShop = mysql_query.update('user_shop',`product_count = ${result[0]['product_count'] + parseInt(paramsObj.count)}`,`product_id = '${result[0]['product_id']}'`)

                //执行修改商品数据语句
                connection.query(updateShop, (err) => {
                    if (err) throw err
                    else {
                        //修改成功，将添加的数量反馈给前端
                        res.send({'message':`数量+${paramsObj.count}`})
                        console.log(`用户：${paramsObj.user_id}下已经存在该商品，已将用户：${paramsObj.user_id}对应的商品数量+${paramsObj.count}`)
                    }
                    //console.log(result)

                })
            }
            //查询结果为空，说明该用户未添加该商品，将商品数据添加到数据库中
            else {
                //创建添加商品数据到user_shop表语句
                const insertShop = mysql_query.insert('user_shop',`USERS_ID,PRODUCT_ID,PRODUCT_TITLE,PRODUCT_IMAGE,PRODUCT_PRICE,PRODUCT_COUNT`,
                    `'${paramsObj.user_id}','${paramsObj.product_id}','${paramsObj.title}','${paramsObj.image}',
                                                                     '${paramsObj.price}','${parseInt(paramsObj.count)}'`)
                //执行添加商品数据语句
                connection.query(insertShop, (err) => {
                    if (err) throw err
                    else {
                        //商品添加成功，将结果反馈给前端
                        res.send({'message':'添加商品成功'})
                        console.log(`用户：${paramsObj.user_id}未曾添加过该商品，已将该商品数据添加到用户：${paramsObj.user_id}下`)
                    }

                })
            }
        })
    })

    app.use('/',router)
}