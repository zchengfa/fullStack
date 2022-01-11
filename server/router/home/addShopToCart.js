module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.post('/addShopToCart', (req, res) => {

        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const product = paramsObj.product
        console.log(product)
        //连接数据库
        const connection = require('../../plugins/connectMysql')()
        const mysql_query = require('../../plugins/mysql_query')
        /*
               * 添加商品前先判断mall_user_cart表中该用户的商品ID和尺码是否已经存在，并且商品的尺码数据一致，若已存在且一致则表示用户之前已添加过该商品，
               * 只需要将商品数量在之前数量的基础上增加用户再次添加的商品数量即可。
               */
        //创建查询该用户下的对应的商品ID以及商品数量语句
        const tableName = 'mall_user_cart'
        const selectProductId = mysql_query.selectFields(tableName,'product_id,quantity,size',`user_id = '${paramsObj.user_id}' AND product_id = '${product.product_id}' AND size = '${product.size}'`)

        connection.query(selectProductId, (err, result) => {
            if (err) throw err
            //console.log(result)
            //如果result不为空，说明当前用户已添加过该商品，只要增加该商品的数量即可
            if (Object.keys(result).length) {
                //创建修改商品数据语句
                const updateShop = mysql_query.update(tableName,`quantity = ${result[0]['quantity'] + product.product_count}`,`product_id = '${result[0]['product_id']}' AND size = '${result[0]['size']}'`)

                //执行修改商品数据语句
                connection.query(updateShop, (err) => {
                    if (err) throw err
                    else {
                        //修改成功，将添加的数量反馈给前端
                        res.send({'message':`数量+${product.product_count}`})
                        console.log(`用户：${paramsObj.user_id}下已经存在该商品，已将用户：${paramsObj.user_id}对应的商品数量+${product.product_count}`)
                    }
                    //console.log(result)

                })
            }
            //查询结果为空，说明该用户未添加该商品，将商品数据添加到数据库中
            else {
                //创建添加商品数据到user_shop表语句
                const insertShop = mysql_query.insert(tableName,`USER_ID,PRODUCT_ID,PRODUCT_TITLE,PRODUCT_IMAGE,PRODUCT_PRICE,quantity,size`,
                    `${paramsObj.user_id},'${product.product_id}','${product.title}','${product.image}',
                                                                     '${product.price}',${product.product_count},'${product.size}'`)
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