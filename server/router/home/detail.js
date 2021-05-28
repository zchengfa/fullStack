module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    const collectionModel = require('../../model/goodsDetailModel')
    const connect = require('../../plugins/connectMysql')

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

    //获取对应用户里对应商品的收藏状态，若该用户已收藏该商品，给前端返回true，反之返回false表示为收藏该商品
    router.get('/userProductCollectionStatus',(req,res) => {
        console.log(req.query)
        const paramsObj = req.query

        const connection = connect()

        //创建查询语句
        const selectQuery = `SELECT COUNT(1) FROM USER_COLLECTION WHERE USERS_ID = '${paramsObj.user_id}' AND PRODUCT_ID = '${paramsObj.product_id}'`

        connection.query(selectQuery,(err, result) => {
            if (err) throw err
            if (result[0]['COUNT(1)'] !== 0) {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'collection_status':true})
            }
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send({'collection_status':false})
            }

        })

    })

    router.get('/changeUserProductCollectionStatus', (req, res) => {
        //接收请求参数
        const paramsObj = req.query
        console.log(paramsObj)
        //连接数据库
        const connection = connect()
        //通过接受的请求参数currentStatus判断，若currentStatus为1表示已收藏，需要取消收藏，若为0表示未收藏，需要收藏商品
        if (Number(paramsObj.currentStatus) === 1) {
            //currentStatus为1，商品已收藏，用户需要取消收藏，将对应用户对应的商品数据进行删除操作
            const deleteQuery = `DELETE FROM USER_COLLECTION WHERE USERS_ID = '${paramsObj.user_id}' AND PRODUCT_ID = '${paramsObj.product_id}'`
            connection.query(deleteQuery, err => {
                if (err) throw err
                else {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'current_status':false})

                    //后续修改，将该商品从该用户中删除后，需要将对应的favorite数量减一
                }
            })
        }
        else if (Number(paramsObj.currentStatus) === 0) {
            //currentStatus为0，商品未收藏，用户需要收藏该商品，将该商品数据添加到该用户中
            const insertQuery = `INSERT INTO USER_COLLECTION(USERS_ID,PRODUCT_ID) VALUES('${paramsObj.user_id}','${paramsObj.product_id}')`
            connection.query(insertQuery, err => {
                if (err) throw err
                else {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.send({'current_status':true})
                }

                //后续修改，将该商品从该用户中删除后，需要将对应的favorite数量加一
            })
        }

    })

    app.use('/home/api', router)
}
