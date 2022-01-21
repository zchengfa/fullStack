const mysql_query = require("../../plugins/mysql_query");
module.exports = app =>{
    const express = require('express')
    const router = express.Router()

    const connection = require('../../plugins/connectMysql')()
    const mysql_query = require('../../plugins/mysql_query')

    router.post('/brand_logo',(req, res) => {
        let paramsObj = JSON.parse(JSON.stringify(req.body))
        const selectBrandLogo = mysql_query.selectFields('mall_brand','brand_logo',`brand_id = ${paramsObj.brand_id}`)
        connection.query(selectBrandLogo,(err,result)=>{
            if (err) throw err
            else{
                result? res.send(result[0]):null
            }
        })
    })

    router.post('/product',(req, res) => {
        let paramsObj = JSON.parse(JSON.stringify(req.body))
        const selectProduct = mysql_query.selectAll('mall_goods',`brand_id = ${paramsObj.brand_id}`)
        connection.query(selectProduct,(err,result)=>{
            if (err) throw err
            else{
                result? res.send({'goods':result}):null
            }
        })
    })

    app.use('/homeContent',router)
}