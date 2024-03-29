const mysql_query = require("../../plugins/mysql_query");
module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const bodyParser = require('body-parser')

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    const connection = require('../../plugins/connectMysql')()
    const mysql_query = require('../../plugins/mysql_query')

    router.post('/userInfo', (req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        //用户头像
        const selectQuery = mysql_query.selectFields('mall_user','avatar',`user_id = '${paramsObj.user_id}'`)

        //商品收藏数量
        const selectQuery2 = mysql_query.selectCount('mall_user_collection', `user_id = '${paramsObj.user_id}'`)

        //品牌收藏数量
        const selectQuery3 = mysql_query.selectCount('mall_user_brand_collection', `user_id = '${paramsObj.user_id}'`)

        //浏览过的商品数量
        const selectQuery4 = mysql_query.selectCount('mall_user_history', `user_id = '${paramsObj.user_id}'`)

        //待付款数量
        const selectWaitOrder = mysql_query.selectCount('mall_store_order',`user_id = '${paramsObj.user_id}' AND payment_status = 0 `)

        //待收货数量
        const selectWaitReceive = mysql_query.selectCount('mall_store_order',`user_id = '${paramsObj.user_id}' AND payment_status = 1 `)

        //待评价数量
        const selectWaitComments = mysql_query.selectCount('mall_store_order',`user_id = '${paramsObj.user_id}' AND payment_status = 3 `)

        connection.query(`${selectQuery +';' +selectQuery2 + ';' +selectQuery3 + ';' +selectQuery4+ ';' + selectWaitOrder +';'
        +selectWaitReceive + ';'+ selectWaitComments }`, (err, results) => {
            if (err) throw err
            else {
                //console.log(results)
                let header_image
                if (results[0]){
                    header_image = results[0][0]['avatar']
                }
                else {
                    header_image = ''
                }
                res.send({
                    'header_image':header_image,
                    'collections': {
                        'shop_collection':{
                            'title':'商品收藏',
                            'count':results[1][0]['COUNT(1)']
                        },
                        'brand_collection':{
                            'title':'品牌收藏',
                            'count':results[2][0]['COUNT(1)']
                        },
                        'history':{
                            'title':'我的足迹',
                            'count':results[3][0]['COUNT(1)']
                        }
                    },
                    'order':{
                        'wait_pay':results[4][0]['COUNT(1)'],
                        'wait_receive':results[5][0]['COUNT(1)'],
                        'wait_comments':results[6][0]['COUNT(1)'],
                    }
                })
            }
        })
    })

    router.post('/addAddress',(req,res)=>{
        let paramsObj = JSON.parse(JSON.stringify(req.body)).info

        const selectAddress = mysql_query.selectCount('mall_user_address',`user_id = ${paramsObj.user_id}`)
        connection.query(selectAddress,(err,address)=>{
            console.log(address)
            if (address[0]['COUNT(1)']){
                addAddress(0)
            }
            else{
                addAddress(1)
            }
        })

        function addAddress(isDefault){
            let addressId = new Date().getTime()
            const insertAddress = mysql_query.insert('mall_user_address','id,user_id,region,username,phone,complete_address,isDefault',
              `${addressId},${paramsObj.user_id},'${paramsObj.region}','${paramsObj.username}','${paramsObj.phone}','${paramsObj['completeAddress']}',${isDefault}`)

            connection.query(insertAddress,(err,result)=>{
                if (err) throw err
                else{
                    result?res.send({
                        code:200,
                        msg:'success'
                    }):null
                }
            })
        }
    })

    router.post('/getUserAddress',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        paramsObj.isDefault?selectAddress(paramsObj.isDefault):selectAddress()

        function selectAddress(isDefault){
            let selectAddress = ''
            isDefault?(()=>{
                selectAddress = mysql_query.selectAll('mall_user_address',`user_id = ${paramsObj.user_id} AND isDefault = ${isDefault}`)
            })():(()=>{
                selectAddress = mysql_query.selectAll('mall_user_address',`user_id = ${paramsObj.user_id}`)
            })()

            connection.query(selectAddress,(err,address)=>{
                if (err) throw err
                else{
                    address?res.send(address):null
                }
            })
        }
    })

    router.post('/removeAddress',(req, res) => {
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const removeQuery = mysql_query.deleteOperation('mall_user_address',`id = ${paramsObj.address_id} AND user_id = ${paramsObj.user_id}`)
        connection.query(removeQuery,(err,removeR)=>{
            if (err) throw err
            if (removeR){
                res.send({'remove_result':true})
            }
        })
    })

    router.post('/alterAddress',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        let objPropertyArr = Object.getOwnPropertyNames(paramsObj.alterInfo)

        //由于数据库不能自动转换bool值，需要先转换再进行数据库操作
        if(objPropertyArr.indexOf('isDefault')!==-1){
            paramsObj.alterInfo.isDefault===true?paramsObj.alterInfo.isDefault = 1:paramsObj.alterInfo.isDefault = 0
        }
        let valuePart = ''
        objPropertyArr.map(item=>{
            valuePart += `${item}='${paramsObj.alterInfo[`${item}`]}',`
        })

        let alterQuery = mysql_query.update('mall_user_address',valuePart.substring(0,valuePart.length-1),`id=${paramsObj.address_id} AND user_id=${paramsObj.user_id}`)

        connection.query(alterQuery,(err,upR)=>{
            if (err) throw err
            if (upR){
                //查看当前用户下的地址中有无多个默认地址，有就只留一个默认，其他修改为不默认
                const selectDefault = mysql_query.selectFields('mall_user_address','id',`user_id = ${paramsObj.user_id} AND isDefault = 1`)
                connection.query(selectDefault,(err,selectR)=>{
                    if (err) throw err
                    if (selectR.length>=2){
                        //除了当前操作的地址，其他全部修改为不默认
                        selectR.map(item=>{
                            if (item.id!==paramsObj.address_id){
                               let alterDefault = mysql_query.update('mall_user_address',`isDefault = 0`,`id = ${item.id}`)
                                connection.query(alterDefault,(err)=>{
                                    if (err) throw err
                                })
                            }
                        })
                    }
                })
                res.send({'edit_result':true})
            }
        })
    })

    app.use('/', router)
}
