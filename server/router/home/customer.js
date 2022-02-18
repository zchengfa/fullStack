
module.exports = app =>{
  const express = require('express')
  const router = express.Router()

  const connection = require('../../plugins/connectMysql')()
  const {selectFields} = require('../../plugins/mysql_query')

  router.post('/customerInfo',(req, res) => {
    const selectCusInfo = selectFields('mall_user','account,username,avatar,gender,identity','identity = 1000')
    connection.query(selectCusInfo,(err,result)=>{
      if (err) throw err
      else{
        res.send({'customer_info':result[0]})
      }
    })

  })

  app.use('/',router)
}