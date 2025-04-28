const {timeFormatting} = require("../../util/timeFormatting");
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
    //console.log(paramsObj)
    //连接数据库
    const connection = require('../../plugins/connectMysql')()
    const mysql_query = require('../../plugins/mysql_query')

    //创建查询符合请求参数的identity字段(是否为管理员)语句
    const selectUser = mysql_query.selectFields('mall_administrator','username,account,avatar,identity',`account = '${paramsObj.account}' 
                                    AND password = '${paramsObj.password}'` )

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

          try{

            //将当前时间作为用户登录时间，并记录在数据库中
            const {timeFormatting} = require('../../util/timeFormatting')
            let loginTime = timeFormatting("YYYY-MM-DD HH:MM:SS")
            const updateQuery = mysql_query.update('mall_administrator',`last_login_time = '${loginTime}'`,`account = "${results[0]['account']}"`)
            connection.query(updateQuery,(err,l)=>{
              if(err) throw err
              else{
                //console.log('用户登录时间已保存至数据库',l)
                //res.send({'success':'登录成功','token':token})
                const selectIdentity = mysql_query.selectFields('mall_administrator','identity',`account = "${results[0]['account']}"`)
                connection.query(selectIdentity,(e,r)=>{

                  if (e) throw e
                  else {
                    let  rights =[{name:'商品管理'},{name:'视频管理'},{name:'用户管理'},{name:'轮播管理'},{name:'库存管理'},{name:'秒杀管理'},{name:'优惠管理'},{name:'订单管理'},{name:'数据统计'},{name:'系统设置'}]
                    rights.forEach((item,index)=>{
                      switch (item.name) {
                        case '商品管理':
                          item.icon = 'Goods'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'商品列表',
                              path:'/goods',
                              rights:['delete','edit','add']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'商品上下架',
                              path:'/grounding',
                              rights:['up','down']
                            }
                          ]
                          break;
                        case '视频管理':
                          item.icon = 'Video'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'视频列表',
                              path:'/video',
                              rights:['delete','add']
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
                        case '轮播管理':
                          item.icon = 'Timer'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'轮播列表',
                              path:'/banner',
                              rights:['close','open']
                            }
                          ]
                          break;
                        case '库存管理':
                          item.icon = 'Unlock'
                          item.children = [

                            {
                              id:index + new Date().getTime(),
                              children_name:'入库管理',
                              path:'/addStore',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'出库管理',
                              path:'/outStore',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'库存调拨',
                              path:'/transferStore',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'盘点管理',
                              path:'/inventory',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'库存预警',
                              path:'/warningStore',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'库存成本管理',
                              path:'/cost',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'库存监控',
                              path:'/monitor',
                              rights:['delete']
                            }
                          ]
                          break;
                        case '秒杀管理':
                          item.icon = 'Van'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'秒杀列表',
                              path:'/seckill',
                              rights:['delete']
                            }
                          ]
                          break;
                        case '优惠管理':
                          item.icon = 'Watch'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'优惠列表',
                              path:'/preferential',
                              rights:['delete','push','add','edit']
                            }
                          ]
                          break;
                        case '订单管理':
                          item.icon = 'Grape'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'订单列表',
                              path:'/order',
                              rights:['delete']
                            }
                          ]
                          break;
                        case '数据统计':
                          item.icon = 'TrendCharts'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'数据监控',
                              path:'/dataMonitor',
                              rights:['delete']
                            },
                            {
                              id:index + new Date().getTime(),
                              children_name:'数据可视化',
                              path:'/dataVisualization',
                              rights:[]
                            }
                          ]
                          break;
                        case '系统设置':
                          item.icon = 'Setting'
                          item.children = [
                            {
                              id:index + new Date().getTime(),
                              children_name:'退出后台',
                              path:'/logout'

                            }
                          ]
                          break;
                        default:
                          return false
                      }

                      item.id = index
                    })

                    if (r[0].identity !== 9999){
                      rights.forEach(item=>{
                        item.children.forEach(i=>{
                          i.rights = []
                        })
                      })
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
        else {
          res.send({'failed':'账号密码错误或不是管理员'})
        }
        console.log(results)
      }
    })
  })

  app.use('/admin',router)
}
