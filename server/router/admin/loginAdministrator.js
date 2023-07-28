const mysql_query = require("../../plugins/mysql_query");
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
       const selectUser = mysql_query.selectFields('mall_administrator','username,account,avatar,identity',`account = '${paramsObj.account}' 
                                    AND password = '${paramsObj.password}' 
                                    AND identity = 9999` )

       connection.query(selectUser,(err,results) => {
           if (err) throw err
           else {
               if (Object.keys(results).length){
                   const {createToken} = require('../../util/token.js')
                   const administrator = {
                       username:results[0].username,
                       account:results[0].account,
                       avatar:results[0].avatar,
                       identity:results[0].identity
                   }
                   //生成token,当过期时间number类型时以秒计算
                   const token = createToken(administrator,'1d')

                   //将生成的token存入数据库中
                   const update = mysql_query.update('mall_administrator',`token = '${token}'`,`account = '${results[0]['account']}'`)

                   connection.query(update, (err) => {
                       if (err) throw err
                       else {
                           console.log('token write success')
                           //用户token写入成功，将token和用户信息返回给前台
                           try{

                               //将当前时间作为用户登录时间，并记录在数据库中
                               const {timeFormatting} = require('../../util/timeFormatting')
                               let loginTime = timeFormatting("YYYY-MM-DD HH:MM:SS")
                               const updateQuery = mysql_query.update('mall_administrator',`last_login_time = '${loginTime}'`,`account = "${results[0]['account']}"`)
                               connection.query(updateQuery,(err,l)=>{
                                   if(err) throw err
                                   else{
                                       console.log('用户登录时间已保存至数据库',l)
                                       //res.send({'success':'登录成功','token':token})
                                       const selectIdentity = mysql_query.selectFields('mall_administrator','identity',`account = "${results[0]['account']}"`)
                                       connection.query(selectIdentity,(e,r)=>{

                                           if (e) throw e
                                           else {


                                               let  rights =[{name:'商品管理'},{name:'用户管理'},{name:'轮播管理'},{name:'库存管理'},{name:'商品上架'},{name:'秒杀管理'},{name:'优惠管理'},{name:'订单管理'},{name:'数据统计'},{name:'系统设置'}]
                                               rights.forEach((item,index)=>{
                                                   switch (item.name) {
                                                       case '商品管理':
                                                           item.icon = 'Goods'
                                                           item.children = [
                                                               {
                                                                   id:index + new Date().getTime(),
                                                                   children_name:'商品列表',
                                                                   path:'/goods',
                                                                   rights:['delete','edit']
                                                               }
                                                           ]
                                                            break;
                                                       case '用户管理':
                                                           item.icon = 'User'
                                                           item.children = [
                                                               {
                                                                   id:index + new Date().getTime(),
                                                                   children_name:'用户列表',
                                                                   path:'/user',
                                                                   rights:['delete']
                                                               }
                                                           ]
                                                           break;
                                                       default:
                                                           return false
                                                   }

                                                   item.id = index
                                               })

                                               if (r[0].identity === 9999){

                                               }
                                               else{

                                               }
                                               res.send({'success':'登录成功','token':token,'userInfo':administrator,'rights':rights})
                                           }
                                       })
                                   }
                               })
                           }catch(e){
                               console.log(e)
                           }
                          
                       }
                   })
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