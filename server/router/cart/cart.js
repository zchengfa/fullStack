const mysql_query = require("../../plugins/mysql_query");

module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    //导入数据库连接模块
    const connection = require('../../plugins/connectMysql')()
    const mysql_query = require('../../plugins/mysql_query')

    //接收前端cart请求，前端需要将用户id传入后端，查询数据库中对应用户的购物车数据，最后返回给前端
    router.post('/cart',(req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const user_id = paramsObj.user_id
    
        //创建查询语句，查询该用户在USER_SHOP表中是否存在商品数据
        const  selectQuery = mysql_query.selectFields('mall_user_cart','product_id,product_title,product_image,product_price,quantity,isChecked,size',
            `user_id = '${user_id}'`)

        //查询数据
        connection.query(selectQuery,(err,result) => {
            if (err) throw err

            if (Object.keys(result).length) {
                //该用户已有商品数据，先进行数据处理再返回给前端
                res.send({'user_cart_data':result,'user_id':user_id})

            }
            else {
                res.send({'empty':'您的购物车空空如也...'})
            }
        })
    })

    //接收前端更新购物车状态请求(需要前端参数：user_id,product_id,status)(用户ID，产品ID，需要更改的状态)
    router.post('/updateChecked', (req,res) => {
        //接收请求参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        let targets = paramsObj.targets
        let finishCount = 0
        console.log(paramsObj.user_id)
        targets.map((item)=>{
            const updateChecked = mysql_query.update('mall_user_cart', `isChecked = ${item.isChecked}`,
                `user_id = '${paramsObj.user_id}' AND product_id = '${item.product_id}' AND size = '${item.size}'`)

            connection.query(updateChecked,(err,result)=>{
                if (err) throw err
                else{
                  Object.keys(result).length? finishCount++:null
                }
                finishCount === targets.length?res.send({'success':1}):null
            })
        })
    })

    //接收前端更新购物车状态请求(需要前端参数：user_id,product_id,count,size)(用户ID，产品ID，需要更改的数量,尺码)
    router.post('/updateProductCount', (req,res) => {
        //接收请求参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)

        //创建更新数据库语句
        const updateCount = mysql_query.update('mall_user_cart',`quantity = ${paramsObj.count}`,
                                                `user_id = '${paramsObj.user_id}' AND product_id = '${paramsObj.product_id}' AND size = '${paramsObj.size}'`)


        //执行更新语句
        connection.query(updateCount, (err) => {
            if (err) throw err
            res.send({'empty':'商品推荐数据暂无'})
            console.log(`ID为：${paramsObj.user_id}的用户下的${paramsObj.product_id}产品数量为${paramsObj.count}`)
        })
    })

    //接收前端更新购物车商品尺码请求，并将更改结果反馈给前端
    router.post('/updateProductSize',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)
        let tableName = 'mall_user_cart'

        const updateProductSize = mysql_query.update(tableName,`size = '${paramsObj.size}'`,
            `user_id = ${paramsObj.user_id} AND product_id = '${paramsObj.product_id}' AND size = '${paramsObj.origin_size}'`)

        connection.query(updateProductSize,(err,result)=>{
          if (err) throw err
          else{
              if (result){
                  //更新完数据后，查询该用户下是否有两件及以上的商品数据的（ID,尺码）是一致的，若有则将相同数据的商品合并成一条数据
                  const selectSameProduct = mysql_query.selectAll(tableName,`user_id = ${paramsObj.user_id} AND product_id = '${paramsObj.product_id}' AND size = '${paramsObj.size}'`)
                  connection.query(selectSameProduct,(err,results)=>{
                      if (err) throw err
                      else{
                          let mergeProduct = {
                              user_id:paramsObj.user_id,
                              product_id:paramsObj.product_id,
                              product_title:results[0]['product_title'],
                              product_image:results[0]['product_image'],
                              product_price:results[0]['product_price'],
                              isChecked:1,
                              size:paramsObj.size
                          }
                          let mergeQuantity = 0

                          //有两条及以上相同数据的商品
                          if (results.length>=2){
                              results.map((item)=>{
                                  mergeQuantity +=item.quantity
                              })

                              mergeProduct.quantity = mergeQuantity
                              //删除相同数据的商品
                              const deleteSameProduct = mysql_query.deleteOperation(tableName,`user_id = ${paramsObj.user_id} AND product_id = '${paramsObj.product_id}' AND size = '${paramsObj.size}'`)
                              connection.query(deleteSameProduct,(err)=>{
                                  if (err) throw err
                                  else{
                                      //删完之后插入合并的商品数据
                                      const insertMergePro = mysql_query.insert(tableName,'user_id,product_id,product_title,product_image,product_price,quantity,isChecked,size',
                                          `${mergeProduct.user_id},'${mergeProduct.product_id}','${mergeProduct.product_title}','${mergeProduct.product_image}',${mergeProduct.product_price},
                                      ${mergeProduct.quantity},${mergeProduct.isChecked},'${mergeProduct.size}'`)

                                      connection.query(insertMergePro,(err,insertRes)=>{
                                          if (err) throw err
                                          else{

                                              //插入成功后，反馈mergeSuccess给前端，表示有多条相同数据商品，已经进行了更新合并操作
                                              insertRes?res.send({'mergeSuccess':1}):null
                                          }
                                      })
                                  }
                              })
                          }
                          //只有一条相同的，更新完后反馈updateSuccess给前端，表示没有多条相同数据的商品，只进行了尺码更新操作
                          else{
                              res.send({'updateSuccess':1})
                          }
                      }
                  })
              }


          }
        })
    })

    //接收前端获取商品推荐数据的请求，将数据返回给前端
    const selectDefault = mysql_query.selectAll('mall_common_recommend_goods')
    router.get('/commonRecommend', (req, res) => {

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
        const user_id= paramsObj.user_id

        const selectUser = mysql_query.selectAll('mall_user_recommend_goods',`user_id = '${user_id}'`)

        connection.query(selectUser,(err,result) => {
            if (err) throw err
            else {
                if (Object.keys(result).length) {
                    res.send({'result':result})
                }
                //该用户没有推荐数据，返回默认的推荐数据
                else {

                    connection.query(selectDefault,(err,result) => {
                        if (err) throw err
                        else {
                            res.send({'result':result,'empty':'该用户暂时还没有推荐数据，返回的是默认推荐数据'})
                        }
                    })
                }
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

        //定义开关变量，解决Cannot set headers after they are sent to the client(发生了多次响应造成的)错误
        let isOver = false
        product_id_array.map(item => {
            const deleteQuery = mysql_query.deleteOperation('mall_user_cart',`user_id = '${user_id}' AND product_id = '${item}'`)
            try {
                connection.query(deleteQuery, err => {
                    if (err) throw err
                })
            }
            catch (err){
                console.log(err)
                res.send(err)
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

    //接收前端发起的商品移入用户收藏夹请求
    router.post('/moveToCollection',(req,res)=>{
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

       //定义开关变量，解决Cannot set headers after they are sent to the client错误
        let isOver = false
        product_id_array.map(item => {
           //插入数据之前需要查询当前用户的收藏表内是否已经收藏过该商品
           const selectQuery = mysql_query.selectFields('mall_user_collection','product_id',`user_id = '${user_id}' AND product_id = '${item}'`)
           connection.query(selectQuery,(err,result)=>{
                if(err) throw err
                else{
                    //判断result中是否有值，有值则表示当前用户已经收藏过当前商品，不需要再进行收藏了,反之则进行收藏操作
                    if(!Object.keys(result).length){

                        const insertQuery = mysql_query.insert('mall_user_collection','user_id,product_id',`'${user_id}','${item}'`)
                        connection.query(insertQuery,err=>{
                            if(err)throw err
                        })
                    }
                }
           })
           return isOver = true
       })
        if (isOver){
            res.send({'success':"收藏成功"})
        }
    })

    app.use('/home/api',router)
}