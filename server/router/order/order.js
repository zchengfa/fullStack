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
    let product_type_arr = []
    let sell_type_arr = []
    paramsObj.order.map(item=>{
      product_id_arr.push(item.product_id)
      product_num_arr.push(item.product_num)
      product_size_arr.push(item.product_size)
      product_type_arr.push(item.product_type)
      sell_type_arr.push(item.sell_type)
    })

    //生成订单ID（时间戳+随机数）
    let order_id = timeFormatting('YYYYMMDDhhmmss') + new Date().getMilliseconds()


    const insertQuery = mysql_query.insert(table_name,'user_id,order_id,product_ids,product_num,product_size,total_num,total_price,product_types,sell_types',
      `${user_id},${order_id},'${JSON.stringify(product_id_arr)}','${JSON.stringify(product_num_arr)}','${JSON.stringify(product_size_arr)}',${total_num},${total_price},
      '${JSON.stringify(product_type_arr)}','${JSON.stringify(sell_type_arr)}'`)
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
      //状态更新完成后，如果之前时确认收货状态，则将订单中含有的商品销量加一，库存减一
      //1.根据订单中的id来查询商品 2.通过查询到的商品id来获取该商品的库存和销量 3.将销量加一，库存减一 4.更新销量与库存
      const selectProductId = mysql_query.selectFields('mall_store_order','product_ids',`user_id = ${paramsObj.user_id} AND order_id = '${paramsObj.order_id}'`)
      connection.query(selectProductId,(err,ids)=>{
        if (err) throw err
        let idsArr = JSON.parse(ids[0]['product_ids'])
        idsArr.map(item=>{

          //获取商品的库存和销量
          const selectSalesAndStocks = mysql_query.selectFields('mall_goods','sales,stocks',`product_id = '${item}'`)
          connection.query(selectSalesAndStocks,(err,result)=>{
            if (err) throw err

            //库存减一，销量加一
            let sales = result[0]['sales'] + 1,stocks = result[0]['stocks'] -1

            //更新商品销量和库存
            const updateSalesAndStocks = mysql_query.update('mall_goods',`sales = ${sales},stocks = ${stocks}`,`product_id = '${item}'`)
            connection.query(updateSalesAndStocks,(err,updateResult)=>{
              if (err) throw err
              console.log(updateResult)
            })
          })
        })
      })
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
      result.length?getUserAllOrderInfo(result,res):res.send(result)
    })
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
            item['product_types'] = JSON.parse(item['product_types'])
            item['sell_types'] = JSON.parse(item['sell_types'])
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

  //接收前端发起的提交评价请求，将提交的数据写入到对应商品中
  router.post('/submitComments',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))

    //根据交易id查询评价的是哪几个商品
    const selectPro_ids = mysql_query.selectFields('mall_store_order','product_ids,product_size',`user_id = ${paramsObj.userInfo.user_id} AND order_id = '${paramsObj.order_id}'`)
    connection.query(selectPro_ids,(err,ids)=>{
      if (err) throw err
      let idArr = JSON.parse(ids[0]['product_ids'])
      let sizeArr = JSON.parse(ids[0]['product_size'])

      let finishN = 0
      idArr.map((item,index)=>{
        const insertComments = mysql_query.insert('mall_user_comments','account,username,avatar,product_id,comments_text,stars,comments_time,size',
          `'${paramsObj.userInfo.account}','${paramsObj.userInfo.username}','${paramsObj.userInfo.avatar}','${item}','${paramsObj.comments}',
          ${paramsObj.starsNum['product_stars']},'${timeFormatting('YYYY/MM/DD')}','${sizeArr[index]}'`)

        connection.query(insertComments,(error,insertR)=>{
          if (error) throw error
          insertR?finishN++:null
          if (finishN===idArr.length){
            //评价完成，将订单表中订单状态进行修改（修改成5 待追评状态）
            const updateOrderStatus = mysql_query.update('mall_store_order','payment_status = 5',`user_id = ${paramsObj.userInfo.user_id} AND order_id = '${paramsObj.order_id}'`)
            connection.query(updateOrderStatus,(e,updateR)=>{
              if (e)throw e
              updateR?res.send('OK'):null
            })
          }
        })
      })
    })
  })

  //接收前端发起的删除用户订单请求
  router.post('/removeUserOrder',(req,res)=>{
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    const removeOrder = mysql_query.deleteOperation('mall_store_order',`user_id = ${paramsObj.user_id} AND order_id = '${paramsObj.order_id}'`)
    connection.query(removeOrder,(err,result)=>{
      if (err) throw err
      result?res.send({'success':1}):res.send({'failed':1})
    })
  })

  app.use('/home/api',router)
}