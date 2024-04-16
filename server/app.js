require('dotenv').config({path:'.env.development.local'})
//导入express模块
const express = require('express')
const http = require('http')
const cors = require('cors')
const {verifyToken} = require("./util/token");
//连接数据库
const connection = require('./plugins/connectMysql')()
const mysql_query = require('./plugins/mysql_query')

const bodyParser = require("body-parser");
const app = express()
const server = http.createServer(app)

//用于解析post请求体中传递过来的参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//允许跨域
app.use(cors())

//除了白名单内的请求，其他请求都必须先进行token验证，验证通过后才能进行当次请求
app.use((req, res, next) => {
  //查询数据库中是否已存储了该ip，若有则不存储，
  let requestQuery = ''
  let category_type = ''
  let product_type = ''
  let product_id = ''
  let sell_type = ''
  let flashSaleTime = ''
  let num = 0
  let keyword = ''
  if (req.url.indexOf('/home/api/goodsData?') >= 0) {
    requestQuery = req.query
  } else if (req.url.indexOf('/home/api/category_detail?') >= 0) {
    category_type = req.query.type
  } else if (req.url.indexOf('/home/api/detail?') >= 0) {
    product_type = req.query.product_type
    product_id = req.query.product_id
    sell_type = req.query.sell_type
  } else if (req.url.indexOf('/home/api/flashSale') >= 0) {
    flashSaleTime = req.query.flashSaleTime
    num = req.query.num
  } else if (req.url.indexOf('/home/api/search') >= 0) {
    keyword = req.query.keyword
  }
  //设置请求地址白名单，只要请求地址是白名单内的都不需要进行token验证
  const urlWhiteList = [
    '/admin/loginAdministrator',
    '/home/api/multiData',
    `/home/api/flashSale?flashSaleTime=${flashSaleTime}&num=${num}`,
    `/home/api/goodsData?user_id=${requestQuery.user_id}&type=${requestQuery.type}&page=${requestQuery.page}`,
    '/login',
    '/verifyMailCode',
    '/home/api/commonRecommend',
    '/home/api/category_list',
    `/home/api/category_detail?type=${encodeURI(category_type)}`,
    `/home/api/detail?product_type=${encodeURI(product_type)}&sell_type=${sell_type}&product_id=${product_id}`,
    '/register',
    '/termsService',
    '/submitDataApi',
    '/homeContent/brand_logo',
    '/homeContent/product',
    '/home/api/cart',
    `/home/api/search?keyword=${encodeURI(keyword)}`,
    '/home/api/hotSearch',
    `/home/api/searchProduct?keyword=${encodeURI(keyword)}`,
    '/refreshToken'
  ]
  if (urlWhiteList.indexOf(req.url) >= 0) {
    next()
    return false
  } else {
    //请求地址不在白名单内，获取请求头中的token
    const token = req.headers.authorization
    if (!token) {
      res.send({err_code: 401, msg: 'token信息错误，不存在！'})
    } else {
      verifyToken(token, (err, decode) => {
        !decode ? res.send({err_code: 4011, msg: 'token信息错误，已过期！'}) : next()
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

//启动server服务
start(server)

//测试mysql数据库是否正常
connectSqlTest('mall_user').then(res=>{
  console.log(res)
}).catch(e=>{
  console.log(e)
})

//用于作者提交商品数据至数据库的api
app.post('/submitDataApi', (req, res) => {
  let paramsObj = JSON.parse(JSON.stringify(req.body)).data
  console.log(paramsObj)
  let shop_num = 42
  const ID = require('./util/createProductID')()
  getBrandIdByBrandName(paramsObj.brand, (err, result) => {
    if (err) throw err
    else {
      let brand_id = null
      result ? brand_id = result[0]['brand_id'] : null
      if (result) {
        getDataTotalNumber((err, total_num) => {
          if (err) throw err
          else {
            let totalNum = null
            total_num ? totalNum = total_num[0]['COUNT(1)'] : null
            let pageNum = getPageNum(shop_num, totalNum)
            if (totalNum) {
              //将前端提交的商品数据存储到数据库
              connection.query(mysql_query.insert('mall_goods', 'product_id,product_title,product_image,' +
                  'product_type,product_brand,preferential_type,price,sales,favorite,sell_type,stocks,unit,isHot,isPreferential,comment_number,brand_id,page,discount',
                  `'${ID}','${paramsObj.description}','${paramsObj.imagePath}','${paramsObj.type}',
                                        '${paramsObj.brand}','${paramsObj['preferential_type']}',${paramsObj.price},${paramsObj['sales']},${paramsObj.favorite},'${paramsObj['sell_type']}',
                                        ${paramsObj['stocks']},'${paramsObj.unit}',${paramsObj['isHot']},${paramsObj['isPreferential']},${paramsObj['comments']},${brand_id},${pageNum},${paramsObj.discount}`),
                (err, result) => {
                  if (err) throw err
                  else {
                    if (result) {

                      let isOver = false
                      paramsObj.params.map(item => {
                        //将商品参数插入到mall_goods_attribute表中
                        connection.query(mysql_query.insert('mall_goods_attribute', 'product_id,attribute_title,attribute', `'${ID}','${item.title + '：'}','${item.text}'`),
                          (err) => {
                            if (err) throw err
                          })
                        return isOver = true
                      })

                      //将商品详情页的图列数据插入到mall_goods_gallery表中
                      //1.查看图列字符串中是否含有分号，若有判断有几个，若没有，当成一张图片地址进行插入

                      //没有分号
                      if (paramsObj['gallery'].indexOf(';') === -1) {
                        insertImageGallery(ID, paramsObj['gallery'])
                      }
                      //有分号
                      else {
                        //1.先判断有几个分号
                        let gallery_arr = paramsObj['gallery'].split(';')
                        gallery_arr.map(item => {
                          item ? insertImageGallery(ID, item) : null
                        })
                      }

                      // connection.query(mysql_query.insert('mall_goods_size','product_id,size',`'${ID}','${paramsObj.size}'`),(err,doc)=>{
                      //     if (err) throw err
                      //     else{
                      //         console.log(doc)
                      //     }
                      // })

                      isOver ? res.send({'success': '添加成功'}) : false
                    }
                  }
                })
            }
          }
        })
      }

    }

  })


  function insertImageGallery(ID, gallery) {
    connection.query(mysql_query.insert('mall_goods_gallery', 'product_id,product_image', `'${ID}','${gallery}'`), (err, re) => {
      if (err) throw err
    })
  }

  function getBrandIdByBrandName(brand, callback) {
    const selectBrandId = mysql_query.selectFields('mall_brand', 'brand_id', `brand = '${brand}'`)
    connection.query(selectBrandId, callback)
  }

  function getDataTotalNumber(callback) {
    const selectCount = mysql_query.selectCount('mall_goods', `sell_type = '${paramsObj['sell_type']}'`)
    connection.query(selectCount, callback)
  }

  function getPageNum(shopNum, total_num) {
    let stringIndex = (total_num / shopNum).toFixed(2).toString().indexOf('.')
    let pageNumString = (total_num / shopNum).toFixed(2).toString()
    return Number(pageNumString.substring(0, stringIndex)) + 1
  }

})

function start(server) {
  //启动服务
  let port = 3000
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
    console.log(`server服务已启动，端口号：(${port})`)
  })
}

//查询一次数据库，以保证mysql数据库正常
function connectSqlTest(table) {
 return new Promise((resolve, reject)=>{
   connection.query(mysql_query.selectAll(table), (err) => {
     if (err) {
       console.log(err,process.env.MYSQL_USER)
       reject('mysql数据库出现异常，请检查是否开启sql服务')
     } else {
       resolve('mysql数据库运行正常')
     }
   })
 })
}
