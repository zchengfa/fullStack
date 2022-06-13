module.exports = app =>{
    const express = require('express')
    const router = express.Router()
    const connection = require('../../plugins/connectMysql')()
    const {update} = require('../../plugins/mysql_query')

    //接收前端发起的下架商品请求，修改商品状态并反馈给前端
    router.post('/groundPro',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        //如果前端传入的参数类型时数组，则需要的时批量上下架，
        if(Array.isArray(paramsObj)){

        }
        else{
           updateGoods(res,paramsObj.params.id,paramsObj.params.status)
           
        }
    })

    const updateGoods = (res,id,grounding_status)=>{
        const updateQuery = update('mall_goods',`isGrounding = ${grounding_status}`,`product_id = '${id}'`)
        connection.query(updateQuery,(err,result)=>{
            if(err) throw err
            if(result){
                res.send({'grounding_status':result})
            }
        })
    }


    app.use('/admin',router)
}