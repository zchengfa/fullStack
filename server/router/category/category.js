module.exports = app => {
    const express = require('express')
    const router = express.Router()

    const categoryListModel = require('../../model/categoryListModel')
    const categoryDetailModel = require('../../model/categoryDetailModel')

    router.get('/category_list', (req, res) => {
        categoryListModel.find({}, (err, docs) => {
            if (err) throw err
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.send({"list":docs[0].list})
        })
    })

    router.get('/category_detail', (req, res) => {
        console.log(req.query)
        categoryDetailModel.find(req.query, (err,result) => {
            if (err) throw err
            else {
                if (Object.keys(result).length) {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({"categoryDetail":result[0].categoryDetail})
                }
            }
        })

    })

    app.use('/home/api', router)
}
