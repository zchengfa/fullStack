
module.exports = app =>{
  const express = require('express')
  const router = express.Router()

  const alipaySdk = require('../../plugins/alipay')
  const AlipayFormData = require('alipay-sdk/lib/form').default

  const mysql_query = require('../../plugins/mysql_query')
  const connection = require('../../plugins/connectMysql')()

  //接收前端发起的支付宝支付请求
  router.post('/alipay',(req,res)=>{
    const paramsObj = JSON.parse(JSON.stringify(req.body)).order

    let order_id = paramsObj.order_id
    let total_price = paramsObj.total_price
    let name = ''

    paramsObj.name.map(item=>{
      name += item
    })

    //防止字符太长，直接让20字符之后的显示省略号
    name = name.substring(0,20)+'...'

    //对接支付宝api
    const formData = new AlipayFormData()

    //调用get方法，会返回可以跳转到支付页面的url
    formData.setMethod('get')

    //注意参数不能填错，subject的值得传入string类型并且它的字符长度不能太长，否则会报参数错误的提示(订单信息无识别，建议联系卖家 INVALID PARAMETER)
    formData.addField('bizContent',{
      out_trade_no:order_id,
      product_code:'FAST_INSTANT_TRADE_PAY',
      total_amount:total_price,
      subject:name
    })

    formData.addField('returnUrl','http://192.168.31.130:8080/paymentStatus')

    const result = alipaySdk.exec('alipay.trade.page.pay',{},{formData:formData})

    result.then(resp=>{
      res.send({
        msg:'支付中',
        paymentUrl:resp
      })
    })
  })

  router.post('/paymentStatus',(req,res)=>{
    const paramsObj = JSON.parse(JSON.stringify(req.body))

    let out_trade_no = paramsObj.out_trade_no
    let trade_no = paramsObj.trade_no
    console.log(paramsObj)
    const formData = new AlipayFormData()

    formData.setMethod('get')

    formData.addField('bizContent',{
      out_trade_no,
      trade_no
    })

    const result = alipaySdk.exec('alipay.trade.query',{},{formData:formData})

    result.then(resp =>{
      const axios = require('axios')

      axios({
        method:'GET',
        url:resp
      }).then(response=>{
        let data = response.data['alipay_trade_query_response']
        if (data.code === '10000'){
          if (data['trade_status'] === 'TRADE_SUCCESS'){
            dealOrder(1,'交易成功')
          }
          else if(data['trade_status'] === 'WAIT_BUYER_PAY'){
            dealOrder(2,'等待买家付款')
          }
          else if(data['trade_status'] === 'TRADE_FINISHED'){
            dealOrder(3,'交易完成')
          }
          else if(data['trade_status'] === 'TRADE_CLOSED'){
            dealOrder(4,'交易关闭')
          }
        }
        console.log(response.data['alipay_trade_query_response'])
      })
    })
    function dealOrder(code,msg){
      const updateOrderStatus = mysql_query.update('mall_store_order',`payment_status = ${code}`,`order_id = '${out_trade_no}'`)
      connection.query(updateOrderStatus,(err,result)=>{
        if (err) throw err
        else{
          result?res.send({
            code,
            msg
          }):null
        }
      })
    }
  })

  app.use('/',router)
}