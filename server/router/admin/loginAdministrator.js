module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

   router.post('/loginAdministrator',(req,res)=> {
       //接受请求参数
       const paramsObj = JSON.parse(JSON.stringify(req.body))
       console.log(paramsObj)
        //连接数据库
       const connection = require('../../plugins/connectMysql')()
       const mysql_query = require('../../plugins/mysql_query')

       //创建查询符合请求参数的identity字段(是否为管理员)语句
       const selectUser = mysql_query.selectFields('user','username,account,header_image,identity',`account = '${paramsObj.account}' 
                                    AND password = '${paramsObj.password}' 
                                    AND identity = 'administrator'` )

       connection.query(selectUser,(err,results) => {
           if (err) throw err
           else {
               if (Object.keys(results).length){
                   const {createToken} = require('../../util/token.js')
                   const administrator = {
                       username:results[0].username,
                       account:results[0].account,
                       avatar:results[0].header_image,
                       identity:results[0].identity
                   }
                   const token = createToken(administrator,'administrator','1d')
                   res.send({'success':'登录成功','token':token})
               }
               else {
                   res.send({'failed':'账号密码错误或不是管理员'})
               }
               console.log(results)
           }
       })
   })

    app.use('/admin',router)
}