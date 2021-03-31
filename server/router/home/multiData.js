module.exports = app =>{
    const express = require('express')

    const router = express.Router()

    const collectionModel = require('../../model/multiDataModel')

    router.get('/multiData', (req, res)=>{
        collectionModel.find({}, (err, doc)=>{
            if(err){
                console.log(err)
            }
            else {
                //console.log(doc)
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send(doc)
            }
        })
    })

    app.use('/home/api', router)
}
