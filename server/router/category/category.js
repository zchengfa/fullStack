module.exports = app => {
    const express = require('express')
    const router = express.Router()

    const categoryDataModel = require('../../model/categoryDataModel')

    router.get('/category_data', (req, res) => {
        categoryDataModel.find({}, (err, docs) => {
            if (err) throw err
            console.log(docs)
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(docs)
        })
    })

    app.use('/home/api', router)
}
