//导入express模块
const express = require('express')

const app = express()

//导入home路由模块
require('./router/home/multiData')(app)
require('./router/home/goodsData')(app)
require('./router/home/detail')(app)

//导入category路由模块
require('./router/category/category')(app)

//导入profile路由模块
require('./router/profile/profile')(app)

//导入login登录模块
require('./router/login/login')(app)

app.get('/',(req,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json('666')
})

app.listen(3000, err =>{
    if(err){
        console.log(err)
    }
    else {
        console.log('localhost:3000 server running')
    }
})
