//导入express模块
const express = require('express')
const http = require('http')
const cors = require('cors')
const {verifyToken} = require("./util/token");
const mysql_query = require("./plugins/mysql_query");
const bodyParser = require("body-parser");
const app = express()
const server = http.createServer(app)

//用于解析post请求体中传递过来的参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//允许跨域
app.use(cors())

//除了/admin/loginAdministrator请求，其他请求都必须先进行token验证，验证通过后才能进行当次请求
app.use((req,res,next)=>{
    let requestQuery = ''
    let category_type = ''
    let product_type = ''
    let product_id = ''
    let user_id =''
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
    else if(req.url.indexOf('/home/api/userProductCollectionStatus?')>=0){
        user_id = req.query.user_id
        product_id = req.query.product_id
    }

    //console.log(req.url,'app.js')
    //设置请求地址白名单，只要请求地址是白名单内的都不需要进行token验证
    const urlWhiteList = [
        '/admin/loginAdministrator',
        '/home/api/multiData',
        `/home/api/goodsData?user_id=${requestQuery.user_id}&type=${requestQuery.type}&page=${requestQuery.page}`,
        '/login' ,
        '/home/api/commonRecommend',
        '/home/api/category_list',
        `/home/api/category_detail?type=${encodeURI(category_type)}`,
        `/home/api/detail?product_type=${product_type}&product_id=${product_id}`,
        `/home/api/userProductCollectionStatus??user_id=${user_id}&product_id=${product_id}`,
        '/register',
        '/termsService',
        '/submitDataApi',
        '/homeContent/brand_logo'
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

//导入首页内容详情模块
require('./router/homeContent/bannerDetail')(app)

server.listen(3000, err =>{
    if(err){
        console.log(err)
    }
    else {
        console.log('localhost:3000 server running')
    }
})

//用于作者提交商品数据至数据库的api
app.post('/submitDataApi',(req, res) => {
    let paramsObj = JSON.parse(JSON.stringify(req.body)).data
    console.log(paramsObj)
    //连接数据库
    const connection = require('./plugins/connectMysql')()
    const ID = require('./util/createProductID')()
    const mysql_query = require('./plugins/mysql_query')

    //将前端提交的商品数据存储到数据库
    connection.query(mysql_query.insert('mall_goods','product_id,product_title,product_image,' +
            'product_type,product_brand,preferential_type,price,sales,favorite,sell_type,stocks,unit,isHot,isPreferential,comment_number',
        `'${ID}','${paramsObj.description}','${paramsObj.imagePath}','${paramsObj.type}',
        '${paramsObj.brand}','${paramsObj['preferential_type']}',${paramsObj.price},${paramsObj['sales']},${paramsObj.favorite},'${paramsObj['sell_type']}',
        ${paramsObj['stocks']},'${paramsObj.unit}',${paramsObj['isHot']},${paramsObj['isPreferential']},${paramsObj['comments']}`),
        (err,result)=>{
        if (err) throw err
        else{
            if (result){

                let isOver = false
                paramsObj.params.map(item =>{
                    //将商品参数插入到mall_goods_attribute表中
                    connection.query(mysql_query.insert('mall_goods_attribute','product_id,attribute_title,attribute',`'${ID}','${item.title+'：'}','${item.text}'`),
                        (err)=>{
                            if (err) throw err
                        })
                    return isOver=true
                })

                //将商品详情页的图列数据插入到mall_goods_gallery表中
                //1.查看图列字符串中是否含有分号，若有判断有几个，若没有，当成一张图片地址进行插入

                //没有分号
                if (paramsObj['gallery'].indexOf(';')===-1){
                    insertImageGallery(ID,paramsObj['gallery'])
                }
                //有分号
                else{
                    //1.先判断有几个分号
                    let gallery_arr = paramsObj['gallery'].split(';')
                    gallery_arr.map(item =>{
                        item?insertImageGallery(ID,item):null
                    })
                }

                connection.query(mysql_query.insert('mall_goods_size','product_id,size',`'${ID}','${paramsObj.size}'`),(err,doc)=>{
                    if (err) throw err
                    else{
                        console.log(doc)
                    }
                })

                isOver?res.send({'success':'添加成功'}):false
            }
        }
    })


    function insertImageGallery(ID,gallery){
        connection.query(mysql_query.insert('mall_goods_gallery','product_id,product_image',`'${ID}','${gallery}'`),(err,re)=>{
            if (err) throw err
        })
    }
})
