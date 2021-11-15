module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const shopManageDataModel = require('../../model/goodsDataModel')

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
        shopManageDataModel.find({}, (err,doc) => {
            if (err) throw err
            else {
                let newDoc = []
                doc.map(item =>{
                    newDoc.push(item)
                    // console.log(newDoc)
                })
                res.send(newDoc)
            }
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
                    favorite:paramsObj.productCount.toString()
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

    //接收前端删除商品请求
    router.post('/deleteProduct',(req,res) => {
        let paramObj = JSON.parse(JSON.stringify(req.body))
        //console.log(paramObj)
        // shopManageDataModel.findOneAndDelete({'product_id':paramObj.product_id},null,(err, doc, res)=>{
        //     console.log(err,doc,res)
        // })
        res.send(paramObj)
    })

    app.use('/admin',router)
}