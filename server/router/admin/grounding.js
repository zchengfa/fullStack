module.exports = app =>{
    const express = require('express')
    const router = express.Router()
    const connection = require('../../plugins/connectMysql')()
    const {update} = require('../../plugins/mysql_query')

    //接收前端发起的下架商品请求，修改商品状态并反馈给前端
    router.post('/groundPro',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        
        //如果前端传入的参数类型是数组，则需要的是批量上下架，
        if(Array.isArray(paramsObj.params.id)){
            let ids = paramsObj.params.id
            ids.map((item,index)=>{
                updateGoods(res,item,paramsObj.params.status,ids.length,index+1)
            })
        }
        else{
           updateGoods(res,paramsObj.params.id,paramsObj.params.status,1,1)
           
        }
    })

    const updateGoods = (res,id,grounding_status,responseCount,currentCount)=>{
        const updateQuery = update('mall_goods',`isGrounding = ${grounding_status}`,`product_id = '${id}'`)
        connection.query(updateQuery,(err,result)=>{
            if(err) throw err
            if(result){
                responseCount===currentCount?res.send({'grounding_result':result}):null
            }
        })
    }


    app.use('/admin',router)
}