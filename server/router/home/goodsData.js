module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    const collectionModel = require('../../model/goodsDataModel')


    router.get('/goodsData', (req, res)=>{
        //获取请求参数
        const query = req.query
        console.log(query)

        //根据请求参数来查询数据库里的数据
        collectionModel.find(query, (err, doc)=>{
            if(err){
                console.log(err)
            }
            else {
								let result = []
								result.push(doc)
                res.send(result)
                //console.log(result)
            }
        })
    })

    app.use('/home/api', router)
}
