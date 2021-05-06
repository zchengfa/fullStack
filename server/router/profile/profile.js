module.exports = app => {
    const express = require('express')
    const router = express.Router()

    router.get('/profile', (req, res) => {
        const profileModel = require('../../model/profileModel')
        profileModel.find({}, (err, docs) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            if (err) {
                res.send(err)
            }
            res.send(docs)
        })
    })

    app.use('/home/api', router)
}