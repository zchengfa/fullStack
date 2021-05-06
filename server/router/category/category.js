module.exports = app => {
    const express = require('express')
    const router = express.Router()

    const categoryListModel = require('../../model/categoryListModel')

    router.get('/category_list', (req, res) => {
        categoryListModel.find({}, (err, docs) => {
            if (err) throw err
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send(docs)
        })
    })

    app.use('/home/api', router)
}
