const mysql_query = require("../../plugins/mysql_query");
module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    const collectionModel = require('../../model/goodsDetailModel')
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
        const selectBase = mysql_query.selectAll('mall_goods',`product_id = '${query.product_id}' AND sell_type = '${query.product_type}'`)
        const selectAttribute = mysql_query.selectFields('mall_goods_attribute','attribute_title,attribute',`product_id = '${query.product_id}'`)
        const selectGallery = mysql_query.selectFields('mall_goods_gallery','product_image',`product_id = '${query.product_id}'`)


        //查询基础数据
        connection.query(selectBase,(err,result) =>{
            if (err) throw err
            else{
                if (result){
                    let detail = {
                        baseData:{},
                        images:[],
                        shop_detail_params:[]
                    }
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
                                    res.send(detail)
                                }
                            })
                        }

                    })


                }
            }
        })

        //根据请求参数来查询数据库里的数据
        // collectionModel.find(query, (err, doc)=>{
        //     if(err){
        //         console.log(err)
        //     }
        //     else {
        //         res.send(doc)
        //
        //     }
        // })
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
        console.log(paramsObj)
        let table_name = 'mall_goods'

        const  shopDataModel= require('../../model/goodsDataModel')
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
                            let favorite = result[0].favorite +1
                            const updateFavorite = mysql_query.update(table_name,`favorite = ${favorite}`,`product_id = '${paramsObj.product_id}'`)
                            connection.query(updateFavorite,(err,results)=>{
                                if (err) throw err
                                else{
                                    results?res.send({'current_status':false}):null
                                }
                            })
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
                    const insertQuery = mysql_query.insert('mall_user_collection','user_id,product_id',`'${paramsObj.user_id}','${paramsObj.product_id}'`)
                    Object.keys(result).length?connection.query(insertQuery,(err,results)=>{
                        if (err) throw err
                        else{
                            results?res.send({'current_status':true}):null
                        }
                    }):null
                }
            })




        }

    })

    app.use('/home/api', router)
}
