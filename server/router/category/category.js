module.exports = app => {
    const express = require('express')
    const router = express.Router()

    const categoryListModel = require('../../model/categoryListModel')
    const categoryDetailModel = require('../../model/categoryDetailModel')

    router.get('/category_list', (req, res) => {
        categoryListModel.find({}, (err, docs) => {
            if (err) console.log(err)
            try{
                res.send({"list":docs[0].list})
            }
            catch (e) {
                res.send({"list":[]})
            }
        })
    })

    router.get('/category_detail', (req, res) => {
        console.log(req.query)
        categoryDetailModel.find(req.query, (err,result) => {
            if (err) throw err
            else {
                if (Object.keys(result).length) {
                    res.send({"categoryDetail":result[0].categoryDetail})
                }
                else {
                    res.send({"empty":"数据暂无"})
                }
            }
        })

    })

    app.use('/home/api', router)
}
