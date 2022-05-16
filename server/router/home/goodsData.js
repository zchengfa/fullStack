//const collectionModel = require("../../model/goodsDataModel");
const connection = require('../../plugins/connectMysql')()
const mysql_query = require('../../plugins/mysql_query')
const {getClientIp} = require("../../util/arrayOperation");
module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    router.get('/flashSale',(req, res) => {
        const selectFlashSale = mysql_query.selectFields('mall_goods','product_id,product_image,price,product_type,sell_type,product_title',`preferential_type = '秒杀' AND flash_sale_time = ${req.query.flashSaleTime}`)
        connection.query(selectFlashSale,(err,result)=>{
            if (err)  throw err
            res.send(result.slice(0,req.query.num))
        })


        //获取用户ip并存储到数据库
        let ip = getClientIp(req)
        const selectIp = mysql_query.selectFields('mall_visitor','ip,count',`ip = '${ip}'`)
        connection.query(selectIp,(err,ips)=>{
            if (err) throw err
            //已存储过，则将count加一
            if (ips.length){
                let count = ips[0]['count'] +1
                const updateIpCount = mysql_query.update('mall_visitor',`count = ${count}`,`ip = '${ip}'`)
                connection.query(updateIpCount,(err)=>{
                    if (err) throw err
                    console.log(`用户：${ip}浏览次数加1`)
                })
            }
            //没有存储过该ip
            else{
                const insertIp = mysql_query.insert('mall_visitor','ip',`'${ip}'`)
                connection.query(insertIp,(err)=>{
                    if (err) throw err
                    console.log('用户ip已记录在数据库中')
                })
            }
        })
    })

    router.get('/goodsData', (req, res)=>{

        //获取请求参数
        const query = req.query
        // console.log(query)
        let isCollected = 0
        let data = []
        //根据请求参数来查询数据库里的数据
        function findData(callback) {
            //collectionModel.find({"type": `${query.type}`, "page": `${query.page}`}, callback)
            connection.query(mysql_query.selectAll('mall_goods',`sell_type = '${query.type}' AND page = ${query.page}`),callback)
        }
        function pushData(newArray,item){
            newArray.push({
                favorite: item.favorite,
                imagePath: item['product_image'],
                page: item.page,
                price: item.price,
                product_id: item.product_id,
                title:item['product_title'],
                sell_type: item['sell_type'],
                product_type:item['product_type'],
                isCollected:isCollected,
                isHot:item['isHot'],
                isPreferential:item['isPreferential'],
                preferential_type:item.preferential_type,
                self_support:item.self_support,
                comment_number:item['comment_number'],
                discount:item.discount,
                stocks:item['stocks']
            })
        }
        if (query.user_id){
            findData((err,doc)=>{
                if (err)throw err
                else{
                    //查询用户收藏过的商品id，改变对应商品的收藏状态
                    const selectQuery = mysql_query.selectFields('mall_user_collection','product_id',`user_id = '${query.user_id}'`)
                    connection.query(selectQuery,(err,result)=>{
                        if (err) throw err
                        else{

                            doc.map(item =>{
                                pushData(data,item)
                            })
                            result.map(items =>{
                                data.map(dataItem =>{
                                    if (items.product_id === dataItem.product_id){
                                        dataItem.isCollected = 1
                                    }
                                })
                            })
                            res.send(data)
                        }
                    })

                }
            })
        }
        else{
            findData((err,doc)=>{
                if (err)throw err
                else{
                    doc.map(item =>{
                       pushData(data,item)
                    })
                    res.send(data)
                }
            })
        }
    })

    router.get('/userCollectionProductId',(req, res) => {
        //console.log(req.query)
        const select_query = mysql_query.selectFields('mall_user_collection','product_id',`user_id = '${req.query.user_id}'`)
        connection.query(select_query,(err,result)=>{
            if (err) {
                res.send({'error':err})
            }
            else {
                if (result.length){

                    res.send({'userCollections':result})
                }
                else {
                    res.send([])
                }
            }
        })
    })

    app.use('/home/api', router)
}
