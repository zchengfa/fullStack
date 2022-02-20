
module.exports = app =>{
  const express = require('express')
  const router = express.Router()

  const connection = require('../../plugins/connectMysql')()
  const {selectFields} = require('../../plugins/mysql_query')

  let user_table = 'mall_user'

  router.post('/customerInfo',(req, res) => {
    const selectCusInfo = selectFields(user_table,'account,username,avatar,gender,identity','identity = 1000')
    connection.query(selectCusInfo,(err,result)=>{
      if (err) throw err
      else{
        res.send({'customer_info':result[0]})
      }
    })

  })

  router.post('/senderInfo',(req, res) => {
    const sender = JSON.parse(JSON.stringify(req.body))['sender']
    console.log(sender)
    const selectSenderInfo = selectFields(user_table,'account,username,avatar,gender',`account = '${sender}' OR username = '${sender}'`)
    connection.query(selectSenderInfo,(err,result)=>{
      if (err) throw err
      else{
        res.send(result)
        console.log(result)
      }
    })
  })

  app.use('/',router)
}