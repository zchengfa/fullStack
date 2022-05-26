module.exports = app =>{
  const express = require('express')
  const router = express.Router()
  const connection = require('../../plugins/connectMysql')()
  const {selectAll} = require('../../plugins/mysql_query')

  router.post('/banner',(req, res) => {
    const selectBanner = selectAll('mall_banner')
    connection.query(selectBanner,(err,result)=>{
      if (err) throw err
      console.log(result)
      res.send(result)
    })

  })

  app.use('/admin',router)
}