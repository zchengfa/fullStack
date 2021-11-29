
module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    //导入token验证模块
    const {verifyToken} = require("../../util/token");

    //导入数据库连接模块
    const connect = require('../../plugins/connectMysql')
    const mysql_query = require('../../plugins/mysql_query')

    //接收前端cart请求，前端需要将用户token传入后端，后端解析token中的用户，查询数据库中对应用户的购物车数据，最后返回给前端
    router.post('/cart',(req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const token = paramsObj.token
        console.log(paramsObj)

        verifyToken(token,'user',(err,decode) => {
            console.log(decode)
            //验证前端传过来的token是否合法，是否过期
            if (err) {
                res.send(err)
            }
            //token合法且未过期，连接数据库，查询对应用户的购物车数据并返回给前端
            else {
                //连接数据库
                const connection = connect()
                //创建查询语句，查询该用户在USER_SHOP表中是否存在商品数据
                const  selectQuery = mysql_query.selectFields('user_shop','product_id,product_title,product_image,product_price,product_count,isChecked',
                    `users_id = '${decode.user_id}'`)

                //查询数据
                connection.query(selectQuery,(err,result) => {
                    console.log(result)
                    if (err) throw err
                    //console.log(Object.keys(result).length)
                    if (Object.keys(result).length) {
                        //该用户已有商品数据，先进行数据处理再返回给前端
                        res.send({'user_cart_data':[result,{'user_id':decode.user_id}]})
                        //console.log(result[0])
                    }
                    else {
                        res.send({'empty':'您的购物车空空如也...'})
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
        const updateChecked = mysql_query.update('user_shop',`isChecked = ${paramsObj.status}`,
                        `users_id = '${paramsObj.user_id}' AND product_id = '${paramsObj.product_id}'`)

        //执行修改数据库语句
        connection.query(updateChecked, (err) => {
            if (err) throw err
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
        const updateCount = mysql_query.update('user_shop',`product_count = ${paramsObj.count}`,
                                                `users_id = '${paramsObj.user_id}' AND product_id = '${paramsObj.product_id}'`)


        //执行更新语句
        connection.query(updateCount, (err) => {
            if (err) throw err
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({'empty':'商品推荐数据暂无'})
            console.log(`ID为：${paramsObj.user_id}的用户下的${paramsObj.product_id}产品数量+${paramsObj.count}`)
        })
    })

    //接收前端获取商品推荐数据的请求，将数据返回给前端
    const selectDefault = mysql_query.selectAll('common_recommend_shop')
    router.get('/commonRecommend', (req, res) => {
        const connection = connect()


        connection.query(selectDefault, (err,result) => {
            if (err) throw err
            else {
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
        verifyToken(token,(err,decode) => {
            if (err) throw err
            else {
                const user_id = decode.user_id
                const selectUser = mysql_query.selectAll('user_recommend_shop',`users_id = '${user_id}'`)

                const connection = connect()

                connection.query(selectUser,(err,result) => {
                    if (err) throw err
                    else {
                        if (Object.keys(result).length) {
                            res.setHeader('Access-Control-Allow-Origin', '*')
                            res.send({'result':result})
                        }
                        //该用户没有推荐数据，返回默认的推荐数据
                        else {

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

    router.post('/remove', (req,res) => {
        //接收参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        let product_id_array = []

        //遍历对象
        for (const paramsObjKey in paramsObj) {
            //将参数push到新数组中
            product_id_array.push(paramsObj[paramsObjKey])
        }

        //从新数组中拿到user_id
        let user_id = product_id_array.shift()

        //连接数据库
        const connection = connect()

        //定义开关变量，解决Cannot set headers after they are sent to the client错误
        let isOver = false
        product_id_array.map(item => {
            const deleteQuery = mysql_query.deleteOpration('user_shop',`users_id = '${user_id}' AND product_id = '${item}'`)
            try {
                connection.query(deleteQuery, err => {
                    if (err) throw err
                })
            }
            catch (err){
                console.log(err)
            }
            finally {
                isOver = true
                console.log('删除成功')
            }

        })
        if (isOver){
            res.send({'success':'删除成功'})
        }


    })

    app.use('/home/api',router)
}