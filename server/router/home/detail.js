module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    const collectionModel = require('../../model/goodsDetailModel')

    router.get('/detail', (req, res)=>{
        //获取请求参数
        const query = req.query
        console.log(query)

        //根据请求参数来查询数据库里的数据
        collectionModel.find(query, (err, doc)=>{
            if(err){
                console.log(err)
            }
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send(doc)

            }
        })
    })
    router.get('/userCollection',(req,res) => {
        console.log(req.query)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.send('doc')
    })

    app.use('/home/api', router)
}
