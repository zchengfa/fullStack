//导入express模块
const express = require('express')
const http = require('http')
const cors = require('cors')
const {verifyToken} = require("./util/token");
const app = express()
const server = http.createServer(app)



//允许跨域
app.use(cors())

//除了/admin/loginAdministrator请求，其他请求都必须先进行token验证，验证通过后才能进行当次请求
app.use((req,res,next)=>{
    let requestQuery = ''
    let category_type = ''
    let product_type = ''
    let product_id = ''
    if (req.url.indexOf('/home/api/goodsData?') >=0){
        requestQuery = req.query
    }
    else if(req.url.indexOf('/home/api/category_detail?') >=0){
        category_type = req.query.type
    }
    else if(req.url.indexOf('/home/api/detail?') >=0){
        product_type = req.query.product_type
        product_id = req.query.product_id
       // console.log(encodeURI(product_id))
    }
    console.log(req.url,'app.js')
    //设置请求地址白名单，只要请求地址是白名单内的都不需要进行token验证
    const urlWhiteList = [
        '/admin/loginAdministrator',
        '/home/api/multiData',
        `/home/api/goodsData?type=${requestQuery.type}&page=${requestQuery.page}`,
        '/login' ,
        '/home/api/commonRecommend',
        '/home/api/category_list',
        `/home/api/category_detail?type=${encodeURI(category_type)}`,
        `/home/api/detail?product_type=${product_type}&product_id=${product_id}`,
        '/register',
        '/termsService'
    ]
    if (urlWhiteList.indexOf(req.url) >= 0){
        next()
        return false
    }
    else{
        //请求地址不在白名单内，获取请求头中的token
        const token = req.headers.authorization
        if (!token){
            res.send({err:401,msg:'token信息错误，不存在或已过期！'})
        }
        else {
            verifyToken(token,(err,decode)=>{
                if (err) throw err
                else {
                    if (!decode){
                        res.send({err:401,msg:'token信息错误，不存在或已过期！'})
                    }
                    else {
                        next()
                    }
                }
            })
        }
    }
})

require('./socket/socket')(server)

//导入home路由模块
require('./router/home/multiData')(app)
require('./router/home/goodsData')(app)
require('./router/home/detail')(app)
require('./router/home/addShopToCart')(app)

//导入category路由模块
require('./router/category/category')(app)

//导入购物车cart路由模块
require('./router/cart/cart')(app)

//导入profile路由模块
require('./router/profile/profile')(app)

//导入login登录模块
require('./router/login/login')(app)

//导入register注册模块
require('./router/register/register')(app)

//导入管理员登录模块
require('./router/admin/loginAdministrator')(app)

//导入商品管理模块
require('./router/admin/shopManage')(app)

//导入用户管理模块
require('./router/admin/memberManage')(app)

server.listen(3000, err =>{
    if(err){
        console.log(err)
    }
    else {
        console.log('localhost:3000 server running')
    }
})
