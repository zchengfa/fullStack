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

    router.get('/userCollectionProductId',(req, res) => {
        console.log(req.query)
        const connection = require('../../plugins/connectMysql')()
        const {selectFields} = require('../../plugins/mysql_query')

        const select_query = selectFields('user_collection','product_id',`users_id = '${req.query.user_id}'`)
        connection.query(select_query,(err,result)=>{
            if (err) {
                res.send({'error':err})
            }
            else {
                if (result.length){

                    res.send({'userCollections':result})
                }
                else {
                    res.send([])
                }
            }
        })
    })

    app.use('/home/api', router)
}
