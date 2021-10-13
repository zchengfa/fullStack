module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const shopManageDataModel = require('../../model/goodsDataModel')
    router.get('/shopManage',(req, res) => {
        shopManageDataModel.find({}, (err,doc) => {
            if (err) throw err
            else {
                let newDoc = []
                doc.map(item =>{
                    newDoc.push(...item.shopData)
                    // console.log(newDoc)
                })
                res.send(newDoc)
            }
        })
    })

    router.post('/addProduct',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        console.log(paramsObj)
        res.send({'send':paramsObj.description})
    })

    app.use('/admin',router)
}