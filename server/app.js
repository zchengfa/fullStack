if(process.env.NODE_ENV === 'development') {
  require('dotenv').config({path:'.env.development'})
}
else if(process.env.NODE_ENV === 'production') {
  require('dotenv').config({path:'.env.local'})
}
const path = require('path')
const fs = require('fs')
//导入express模块
const express = require('express')
const http = require('http')
const cors = require('cors')
const {PrismaClient} = require('@prisma/client')
const moduleExportsFunction = require('./util/moduleExportsFunction')
const bodyParser = require("body-parser");
const {getLocalIP,checkProcessEnvParam, currentFileName} = require("./util/util");

const prisma = new PrismaClient()
const PrismaSeed = require('./prisma/seed.js')

const app = express()
const server = http.createServer(app)
let port = process.env.PORT | 3000

//用于解析post请求体中传递过来的参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//允许跨域
app.use(cors({
  origin:process.env.CORS_ORIGIN
}))

//将前端上传的文件保存后，配置静态资源服务，使得前端可以直接访问该目录下的资源
app.use(express.static('uploads'))

//执行模块导入
moduleExportsFunction({app,server,port,prisma})

const start =async (server)=> {
  //启动服务前对后台各个模块所需的参数进行检测，若参数未设置则给出提示
  checkProcessEnvParam()
  await PrismaSeed(prisma)
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
    if(process.env.NODE_ENV === 'development') {
      console.log(`${currentFileName(__filename,true)}server服务已启动，地址为：${getLocalIP()}:${port}`)
    }
    else{
      console.log(`${currentFileName(__filename,true)}server服务已启动，端口为：${port}`)
    }
  })
}

//创建temp_uploads、chunks和uploads文件夹，用于管理平台上传文件时的临时存储环境
const createTempDir = ()=>{
  const directoryArray = ['temp_uploads','uploads','/router/admin/chunks']
  directoryArray.map(async (item)=>{
    try{
      const resolveDir = path.join(__dirname, item)
      try{
        await fs.promises.access(resolveDir)
      }
      catch (err) {
        //没有文件夹会被捕获为错误
        await fs.promises.mkdir(resolveDir)
      }
    }catch (e) {
      console.log(`${item}文件夹创建失败，失败提示：${e}`)
    }
  })

}

//启动server服务
start(server)

//创建文件夹
if(process.env.NODE_ENV === 'development'){
  createTempDir()
}

//导出app实例供vercel使用
module.exports = app
