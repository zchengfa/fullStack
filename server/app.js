require('dotenv').config({path:'.env.development.local'})
const path = require('path')
const fs = require('fs')
//导入express模块
const express = require('express')
const http = require('http')
const cors = require('cors')
//连接数据库
const connection = require('./plugins/connectMysql')()
const mysql_query = require('./plugins/mysql_query')

const bodyParser = require("body-parser");
const {getLocalIP} = require("./util/util");
const app = express()
const server = http.createServer(app)
let port = process.env.PORT | 3000

//用于解析post请求体中传递过来的参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//允许跨域
app.use(cors())

//将前端上传的文件保存后，配置静态资源服务，使得前端可以直接访问该目录下的资源
app.use(express.static('uploads'))

//导入请求拦截模块
require('./util/requestInterceptor')(app)

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

//导入文件上传模块
require('./router/admin/uploadFile')(app,port)

//导入商品管理模块
require('./router/admin/shopManage')(app)

//导入用户管理模块
require('./router/admin/memberManage')(app)

//导入轮播图管理模块
require('./router/admin/bannerManage')(app)

//导入商品上下架管理模块
require('./router/admin/grounding')(app)

//导入秒杀管理模块
require('./router/admin/seckill')(app)

//导入订单管理模块
require('./router/admin/orderManage')(app)

//导入数据统计模块
require('./router/admin/statistics')(app)

//导入优惠券管理模块
require('./router/admin/preferential')(app)

//导入首页内容详情模块
require('./router/homeContent/bannerDetail')(app)

//导入搜索模块
require('./router/homeContent/search')(app)

//导入客服模块
require('./router/home/customer')(app)

//导入支付宝支付模块
require('./router/alipay/pay')(app)

//导入订单模块
require('./router/order/order')(app)

//导入提交商品数据模块
require('./router/admin/submitTest')(app)

const start = (server)=> {
  //启动服务
  server.listen(port)
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      port += 1
      server.listen(port)
    } else {
      throw err
    }
  })
  server.on('listening', () => {
    console.log(`server服务已启动，地址为：${getLocalIP()}:${port}`)
  })
}
//查询一次数据库，以保证mysql数据库正常
const connectSqlTest = (table)=> {
  return new Promise((resolve, reject)=>{
    connection.query(mysql_query.selectAll(table), (err) => {
      if (err) {
        // console.log(err,process.env.MYSQL_USER)
        reject('mysql数据库出现异常，请检查是否开启sql服务')
      } else {
        resolve('mysql数据库运行正常')
      }
    })
  })
}

//创建temp_uploads、chunks和uploads文件夹，用于管理平台上传文件时的临时存储环境
const createTempDir = ()=>{
  const directoryArray = ['temp_uploads','uploads','/router/admin/chunks']
  directoryArray.map((item)=>{
    try{
      const resolveDir = path.join(__dirname, item)
      if(!fs.existsSync(resolveDir)){
        fs.mkdirSync(resolveDir);
        console.log(`${item}文件夹创建成功`)
      }
    }catch (e) {
      console.log(`${item}文件夹创建失败，失败提示：${e}`)
    }
  })

}

//启动server服务
start(server)

//测试mysql数据库是否正常
connectSqlTest('mall_user').then(res=>{
  console.log(res)
}).catch(e=>{
  console.log(e)
})

//创建文件夹
createTempDir()
