const express = require('express')
const {currentFileName} = require("../../util/util");
const router = express.Router()
module.exports = (app,prisma) =>{
    //接收前端发起的下架商品请求，修改商品状态并反馈给前端
    router.post('/groundPro',(req,res)=>{
        const paramsObj = JSON.parse(JSON.stringify(req.body))
        const isArr = Array.isArray(paramsObj.params.id)
        let arr = []
        isArr ? arr = paramsObj.params.id : arr.push(paramsObj.params.id)

        try{
            arr.map(async (item)=>{
                try{
                    await prisma.mall_goods.update({
                        where:{
                            product_id: item,
                        },
                        data:{
                            isGrounding:paramsObj.params.status,
                        }
                    })
                }
                catch (e){
                    console.log(currentFileName(__filename)+ e)
                }
            })
            res.send({grounding_result:true})
        }
        catch (e) {
            console.log(currentFileName(__filename)+ e)
            res.status(500).send({errMessage:'服务器出现错误'})
        }

    })

    app.use('/admin',router)
}
