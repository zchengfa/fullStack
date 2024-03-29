module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const shopManageDataModel = require('../../model/goodsDataModel')
    const mysql_query = require('../../plugins/mysql_query')
    const connection = require('../../plugins/connectMysql')()

    //接收前端获取管理员信息请求
    router.post('/administratorInfo',(req, res) => {
        const paramObj = JSON.parse(JSON.stringify(req.body))
        const {verifyToken} = require('../../util/token')

        verifyToken(paramObj.token,(err,decode)=>{
           if (err){
               console.log(err)
               res.send(err)
           }
            else {
                //console.log(decode)
               res.send({'info':decode})
           }
        })
        //console.log(paramObj.token)
    })

    //接收前端获取商品数据请求
    router.get('/shopManage',(req, res) => {
        // shopManageDataModel.find({}, (err,doc) => {
        //     if (err) throw err
        //     else {
        //         let newDoc = []
        //         doc.map(item =>{
        //             newDoc.push(item)
        //             // console.log(newDoc)
        //         })
        //         res.send(newDoc)
        //     }
        // })
        const selectGoods = mysql_query.selectAll('mall_goods')
        connection.query(selectGoods,(err,result)=>{
            if (err) throw err
            res.send(result)

        })
    })

    //接收前端添加商品请求
    router.post('/addProduct',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const productID = require('../../util/createProductID')()
        let insertData = {
            type:['pop','sell','new'][Math.round(Math.random()*2)],
            page:Math.round(Math.random()*10),
            shopData:[
                {
                    product_id:productID,
                    title:paramsObj.description,
                    imagePath:paramsObj.imageLink,
                    price:'￥'+paramsObj.price,
                    origin_price:'￥'+(paramsObj.price*1.2).toFixed(1),
                    stocks:paramsObj.productCount.toString()
                }
            ]
        }
        shopManageDataModel.insertMany([insertData],{rawResult:true}).then(result =>{
            if (result){
                res.send({'success':true,'product_id':productID})
            }
        }).catch(err =>{
            res.send(err)
        })
    })
		
    router.post('/alterProduct',(req,res)=>{
				let bodyData = JSON.parse(JSON.stringify(req.body))
				let product_id = bodyData.product_id
				let paramsObj = bodyData.alterData
				console.log(bodyData)
        const updateGoods = mysql_query.update('mall_goods',`product_title = '${paramsObj.title}',
        product_image = '${paramsObj.imagePath}',stocks = ${paramsObj.count},price = ${paramsObj.price}`,`product_id = '${product_id}'`)
        connection.query(updateGoods,(err,updateR)=>{
            if (err) throw err
            console.log(updateR)
            res.send({'success':'编辑成功'})
        })
				// shopManageDataModel.updateOne({'product_id':product_id},{'title':paramsObj.title,'imagePath':paramsObj.imagePath,
				// 'price':paramsObj.price,'stocks':paramsObj.count},(err,result)=>{
				// 	if(err)console.error(err)
				// 	else{
				// 		res.send({'success':'编辑成功'})
				// 	}
				// })
    })

    //接收前端删除商品请求
    router.post('/deleteProduct',(req,res) => {
        let paramObj = JSON.parse(JSON.stringify(req.body))
        //console.log(paramObj)
        shopManageDataModel.findOneAndDelete({'product_id':paramObj.product_id},null,(err, doc)=>{
            if (err) {
                res.send({'error':err})
            }
            else {
                if (doc){
                    res.send({'success':'删除成功'})
                }
               else {
                   res.send({'failed':'删除失败'})
                }
            }
            console.log(err,doc)
        })
    })

    app.use('/admin',router)
}