const {timeFormatting} = require("../../util/timeFormatting");
const {currentFileName} = require("../../util/util");
const {createToken} = require('../../util/token.js')
const {createRight} = require("../../util/rights.js");

module.exports = (app,prisma) => {
  const express = require('express')
  const router = express.Router()

  router.post('/loginAdministrator',async (req,res)=> {
      //接受请求参数
      const paramsObj = JSON.parse(JSON.stringify(req.body))

      try{
          //创建查询符合请求参数的identity字段(是否为管理员)语句
          const prismaIdentityQuery = await prisma.mall_administrator.findUnique({
              where:{
                  account:paramsObj.account,
                  password:paramsObj.password,
              }
          })
          if(prismaIdentityQuery){

              const administrator = {
                  username:prismaIdentityQuery.username,
                  account:prismaIdentityQuery.account,
                  identity:prismaIdentityQuery.identity,
                  avatar:prismaIdentityQuery.avatar,
                  id:prismaIdentityQuery.user_id.toString(),
              }
              //生成token,当过期时间number类型时以秒计算
              const token = createToken({
                  id:prismaIdentityQuery.user_id.toString(),
                  username:prismaIdentityQuery.username,
                  account:prismaIdentityQuery.account,
              },'1d')

              const loginTime = new Date(timeFormatting("YYYY-MM-DD HH:MM:SS"))

              //更新数据库中的登陆时间
              const prismaUpdate = await prisma.mall_administrator.update({
                  where:{
                      account:paramsObj.account,
                  },
                  data:{
                      last_login_time:loginTime,
                  }
              })

              let  rights =[{name:'商品管理'},{name:'视频管理'},{name:'用户管理'},{name:'轮播管理'},{name:'库存管理'},{name:'秒杀管理'},{name:'优惠管理'},{name:'订单管理'},{name:'数据统计'},{name:'系统设置'}]

              res.send({'success':'登录成功','token':token,'userInfo':administrator,'rights':createRight(prismaUpdate,rights)})

          }
          else {
              res.send({'failed':'账号密码错误或不是管理员'})
          }
      }
      catch (e) {
          console.log(currentFileName(__filename) + e)
          res.status(500).send({errMessage:'服务器出现问题'})
      }
  })

  app.use('/admin',router)
}
