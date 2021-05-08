module.exports = app => {
    const express = require('express')
    const router = express.Router()

    //接收前端cart请求，前端需要将用户token传入后端，后端解析token中的用户，查询数据库中对应用户的购物车数据，最后返回给前端
    router.post('/cart',(req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send({'empty':'您的购物车空空如也...'})
    })

    //接收前端获取商品推荐数据的请求，将数据返回给前端
    router.get('/recommend', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send({'empty':'商品推荐数据暂无'})
    })

    app.use('/home/api',router)
}