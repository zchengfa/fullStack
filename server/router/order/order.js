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

  app.use('/home/api',router)
}