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

    app.use('/admin',router)
}