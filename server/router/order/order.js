const {timeFormatting} = require("../../util/timeFormatting");
const mysql_query = require("../../plugins/mysql_query");
const connection = require('../../plugins/connectMysql')()
module.exports = app =>{
  const express = require('express')
  const router = express.Router()
  let table_name = 'mall_store_order'

  //接收前端发起的提交订单请求,将订单信息存入对应的用户下，并返回订单编号给前端
  router.post('/submitOrder',(req,res)=>{
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    let user_id = paramsObj.user_id
    let total_num = paramsObj.total_num
    let total_price = paramsObj.total_price
    let product_id_arr = []
    let product_num_arr = []
    let product_size_arr = []
    paramsObj.order.map(item=>{
      product_id_arr.push(item.product_id)
      product_num_arr.push(item.product_num)
      product_size_arr.push(item.product_size)

    })

    //生成订单ID（时间戳+随机数）
    let order_id = timeFormatting('YYYYMMDDhhmmss') + new Date().getMilliseconds()


    const insertQuery = mysql_query.insert(table_name,'user_id,order_id,product_ids,product_num,product_size,total_num,total_price',
      `${user_id},${order_id},'${JSON.stringify(product_id_arr)}','${JSON.stringify(product_num_arr)}','${JSON.stringify(product_size_arr)}',${total_num},${total_price}`)
    connection.query(insertQuery,(err,result)=>{
      if (err) throw err
      else{
        if (Object.keys(result).length){
          const selectOrderId = mysql_query.selectFields(table_name,'order_id',
            `user_id = ${user_id} AND product_ids = '${JSON.stringify(product_id_arr)}' AND product_num = '${JSON.stringify(product_num_arr)}' AND product_size = '${JSON.stringify(product_size_arr)}'`)
          connection.query(selectOrderId,(err,orderId)=>{

            //将订单编号返回给前端
            res.send({'order_id':orderId[0]['order_id']})
          })
        }
      }
    })
  })

  router.post('/orderInfo',(req,res)=>{
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    const selectOrder = mysql_query.selectAll(table_name,`user_id = ${paramsObj.user_id} AND order_id = ${paramsObj.order_id}`)

    connection.query(selectOrder, (err,result)=>{
      if (err) throw err
      else{
        if (Object.keys(result).length){
          let product_id_arr = JSON.parse(result[0]['product_ids'])
          let product_num_arr = JSON.parse(result[0]['product_num'])
          let product_size_arr = JSON.parse(result[0]['product_size'])
          let payment_status = result[0]['payment_status']
          let info_arr = []
          let finishCount = 0

          product_id_arr.map((item,index)=>{
            const selectProductInfo = mysql_query.selectFields('mall_goods','product_title,product_image,price,sell_type,product_type',`product_id = '${item}'`)
            connection.query(selectProductInfo,(err,info)=>{
              if (info){
                info_arr.push({
                  'product_id':item,
                  'product_title':info[0]['product_title'],
                  'product_image':info[0]['product_image'],
                  'quantity':product_num_arr[index],
                  'size':product_size_arr[index],
                  'price':info[0]['price'],
                  'sell_type':info[0]['sell_type'],
                  'product_type':info[0]['product_type']
                })
                finishCount++
                finishCount===product_id_arr.length?res.send({
                  info_arr,
                  payment_status
                }):null
              }
            })
          })
        }
      }
    })
  })

  router.post('/userAllOrder',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    const selectAllOrder = mysql_query.selectAll('mall_store_order',`user_id = ${paramsObj.user_id}`)
    connection.query(selectAllOrder,(err,result)=>{
      if (err)throw err
      getUserAllOrderInfo(result,res)
    })
  })

  //接收前端发起的确认收货请求
  router.post('/confirmReceiveOrder',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    const updateOrder = mysql_query.update('mall_store_order',`payment_status = 2`,`user_id = ${paramsObj.user_id} AND order_id = '${paramsObj.order_id}'`)

    connection.query(updateOrder,(err)=>{
      if (err) throw err
      res.status(200)
      res.send()
    })
  })

  //接收前端发起的更改订单状态请求
  router.post('/updateOrderStatus',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    const updateOrder = mysql_query.update('mall_store_order',`payment_status = ${paramsObj.status}`,`user_id = ${paramsObj.user_id} AND order_id = '${paramsObj.order_id}'`)

    connection.query(updateOrder,(err)=>{
      if (err) throw err
      res.status(200)
      res.send()
    })
  })

  //接收前端发起的获取用户待评价商品请求
  router.post('/waitComments',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))

    const selectComments = mysql_query.selectAll('mall_store_order',`user_id = ${paramsObj.user_id} AND payment_status = 3`)
    connection.query(selectComments,(err,result)=>{
      if (err)throw err
      getUserAllOrderInfo(result,res)
    })
    //res.send(paramsObj)
  })

  //获取用户所需订单信息
  function getUserAllOrderInfo (result,res){
    let finishResultCount = 0
    result.map(item =>{

      //将字符串转换
      let product_ids = JSON.parse(item['product_ids'])

      //表示获取到的图片个数
      let finishCount = 0
      item['product_image'] = []
      item['product_title'] = []
      product_ids.map(id =>{
        const selectImg = mysql_query.selectFields('mall_goods','product_image,product_title',`product_id = '${id}'`)
        connection.query(selectImg,(err,img)=>{
          if (err) throw err
          let image = img[0]['product_image']
          let title = img[0]['product_title']
          item['product_image'].push(image)
          item['product_title'].push(title)


          //每获取完一张图片就加一
          finishCount++

          //当获取到的图片数与产品id数一致时进行下一步操作
          if (finishCount===product_ids.length){
            item['product_ids'] = JSON.parse(item['product_ids'])
            item['product_num'] = JSON.parse(item['product_num'])
            item['product_size'] = JSON.parse(item['product_size'])
            finishResultCount++

            //当所有数据都获取完后才给前端发送反馈
            if (finishResultCount===result.length){
              res.send(result)
            }
          }
        })
      })
    })
  }


  app.use('/home/api',router)
}