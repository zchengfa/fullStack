const mysql_query = require("../../plugins/mysql_query");
module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    const connection = require('../../plugins/connectMysql')()
    const mysql_query = require('../../plugins/mysql_query')

    router.get('/detail', (req, res)=>{
        //获取请求参数
        const query = req.query
        console.log(query,'detail.js',12)

        /**
         * 查询数据库中在详情页需要的数据
         * (基础数据表、商品图片列表、商品参数表)
         */
        const selectBase = mysql_query.selectAll('mall_goods',`product_id = '${query.product_id}'`)
        const selectAttribute = mysql_query.selectFields('mall_goods_attribute','attribute_title,attribute',`product_id = '${query.product_id}'`)
        const selectGallery = mysql_query.selectFields('mall_goods_gallery','product_image',`product_id = '${query.product_id}'`)
        const selectRecommend = mysql_query.selectAll('mall_goods',`product_type = '${query.product_type}'`)

        let detail = {
            baseData:{},
            images:[],
            shop_detail_params:[],
            recommend_data:[]
        }

        //查询基础数据
        connection.query(selectBase,(err,result) =>{
            if (err) throw err
            else{
                if (result){
                    result.map(item => {
                        detail.baseData = item
                    })
                    //查询商品参数
                    connection.query(selectAttribute,(err,results)=>{
                        if (err) throw err
                        else{
                            results.map(item =>{
                                detail.shop_detail_params.push(item)
                            })
                            //查询商品图片列
                            connection.query(selectGallery,(err,resultsGallery)=>{
                                if (err) throw err
                                else{
                                    resultsGallery.map(item =>{
                                        detail.images.push(item)
                                    })
                                    //根据用户点击的商品类型，从该类型中随机选取一部分商品数据返回前端
                                    connection.query(selectRecommend,(err,recommend)=>{
                                        if (err) throw err
                                        else{
                                            recommend.map(item=>{
                                                item.product_id!==query.product_id?detail.recommend_data.push(item):null
                                            })
                                            res.send(detail)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })

        //如果接受的参数中有用户id，则说明用户登录了，可以进行用户浏览商品历史数据的存储
        if (query.user_id){
            let tableName = 'mall_user_history'
            const selectHistory = mysql_query.selectCount(tableName,`user_id = ${query.user_id} AND product_id = '${query.product_id}'`)
            const insertHistory = mysql_query.insert(tableName,'user_id,product_id',`${query.user_id},'${query.product_id}'`)

            //插入数据前先查看是否已经存储过该商品的数据，若存储过则不进行存储，反之则存储
            connection.query(selectHistory,(err,selectR)=>{
                if (err) throw err
                else{
                    if (!selectR[0]['COUNT(1)']){
                        connection.query(insertHistory,(err,historyR)=>{
                            if (err) throw err
                            console.log(historyR)
                        })
                    }
                }
            })

        }
    })

    //获取对应用户里对应商品的收藏状态，若该用户已收藏该商品，给前端返回true，反之返回false表示为收藏该商品
    router.get('/userProductCollectionStatus',(req,res) => {
        //console.log(req.query)
        const paramsObj = req.query

        //创建查询语句
        const selectQuery = mysql_query.selectCount('mall_user_collection',`user_id = '${paramsObj.user_id}' AND product_id = '${paramsObj.product_id}'`)

        connection.query(selectQuery,(err, result) => {
            if (err) throw err
            if (result[0]['COUNT(1)'] !== 0) {
                res.send({'collection_status':true})
            }
            else {
                res.send({'collection_status':false})
            }

        })

    })

    router.get('/changeUserProductCollectionStatus', (req, res) => {
        //接收请求参数
        const paramsObj = req.query
        let table_name = 'mall_goods'

        //通过接受的请求参数currentStatus判断，若currentStatus为1表示已收藏，需要取消收藏，若为0表示未收藏，需要收藏商品
        if (Number(paramsObj.currentStatus) === 1) {
            //currentStatus为1，商品已收藏，用户需要取消收藏，将对应用户对应的商品数据进行删除操作
            const deleteQuery = mysql_query.deleteOperation('mall_user_collection',`user_id = '${paramsObj.user_id}' AND product_id = '${paramsObj.product_id}'`)

            connection.query(deleteQuery, err => {
                if (err) throw err
                else {
                    //有用户取消了收藏，将对应的商品收藏数减一
                    //1.先查询当前商品的收藏总数
                    const selectFavorite = mysql_query.selectFields(table_name,'favorite',`product_id = '${paramsObj.product_id}'`)
                    connection.query(selectFavorite,(err,result)=>{
                        if (err) throw err
                        else{
                            //2.将该商品的喜爱数减一
                            result?(changeProductFavorite(table_name,paramsObj.product_id,false)?res.send({'current_status':false}):null):null
                        }
                    })
                }
            })
        }
        else if (Number(paramsObj.currentStatus) === 0) {
            //currentStatus为0，商品未收藏，用户需要收藏该商品，将该商品数据添加到该用户中
            //1.查询mall_user_collection需要的字段数据
            const selectField = mysql_query.selectFields(table_name,'product_title,product_type,price,product_image',`product_id = '${paramsObj.product_id}'`)
            connection.query(selectField,(err,result)=>{
                if (err) throw  err
                else{
                    //2.插入数据
                    const insertQuery = mysql_query.insert('mall_user_collection','user_id,product_id,product_title,product_type,price,product_image',
                        `'${paramsObj.user_id}','${paramsObj.product_id}','${result[0]['product_title']}','${result[0]['product_type']}',
                        ${result[0]['price']},'${result[0]['product_image']}'`)
                    Object.keys(result).length?connection.query(insertQuery,(err,results)=>{
                        if (err) throw err
                        else{

                            //数据插入成功，表示收藏完成，然后将该商品的喜爱数加一
                            results?(changeProductFavorite(table_name,paramsObj.product_id,true)?res.send({'current_status':true}):null):null
                        }
                    }):null
                }
            })
        }
        function changeProductFavorite(table_name,product_id,boolean){
            //boolean为true表示需要加一，为false则需要减一
            const selectFavorite = mysql_query.selectFields(table_name,'favorite',`product_id = '${product_id}'`)
            connection.query(selectFavorite,(err,result)=>{
                if (err) throw err
                else{
                    //2.将该商品的喜爱数减一
                    boolean?(()=>{
                        let favorite = result[0]['favorite']+1
                        return updateProductFavorite(table_name,product_id,favorite)

                    })():(()=>{
                        let favorite = result[0]['favorite']-1
                        return updateProductFavorite(table_name,product_id,favorite)
                    })()
                }
            })
            return true
        }
        function updateProductFavorite(tableName,product_id,favorite){
            const updateFavorite = mysql_query.update(table_name,`favorite = ${favorite}`,`product_id = '${product_id}'`)
            connection.query(updateFavorite,(err)=>{
                if (err) throw err
            })
            return true
        }

    })

    app.use('/home/api', router)
}
