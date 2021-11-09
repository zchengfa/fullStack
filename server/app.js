//导入express模块
const express = require('express')
const http = require('http')
const cors = require('cors')
const app = express()
const server = http.createServer(app)



//允许跨域
app.use(cors())

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



app.get('/',(req,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json('666')
})

server.listen(3000, err =>{
    if(err){
        console.log(err)
    }
    else {
        console.log('localhost:3000 server running')
    }
})
