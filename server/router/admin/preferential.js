const express = require("express");
const mysql_query = require("../../plugins/mysql_query");
const bodyParser = require('body-parser')
module.exports = app => {

    const router = express.Router()
    const connection = require('../../plugins/connectMysql')()
    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

    router.get('/preferential',(req, res) => {

        const selectPreferential = mysql_query.selectAll('mall_preferential')
        connection.query(selectPreferential,(err,result)=>{
            if (err) throw err
            res.send({query:result})
            console.log(result)
        })
    })

    router.post('/releasePreferential',(req, res) => {

        //接受请求参数
        const paramsObj = JSON.parse(JSON.stringify(req.body))

        const updatePreferential = mysql_query.update('mall_preferential',`release_status = ${paramsObj.status}`,`id = ${paramsObj.id}`)
        try {
            connection.query(updatePreferential,(err,result)=>{
                if (err) throw err
                else{
                    paramsObj.status ? res.send({msg:'发布成功'}) : res.send({msg:'已撤回'})
                }
            })
        }
        catch (e) {
            res.send({err:'发生错误'})
        }
    })

    app.use('/admin',router)
}