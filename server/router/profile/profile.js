module.exports = app => {
    const express = require('express')
    const router = express.Router()

    router.post('/login', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send('docs')
    })

    app.use('/home/api', router)
}