
module.exports = app =>{
  const express = require('express')
  const router = express.Router()
  const connection = require('../../plugins/connectMysql')()
  const {update} = require('../../plugins/mysql_query')

  router.post('/saveFlashTime',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))

    let finishCount = 0
    paramsObj.data.map(item=>{
      const updateTime = update('mall_goods',`flash_sale_time = ${item.time}`,`product_id = '${item.id}'`)
      connection.query(updateTime,(err,upR)=>{
        if (err) throw err
        Object.keys(upR).length?finishCount++:null
        finishCount===paramsObj.data.length?res.send({'saveResult':true}):null
      })
    })
  })

  app.use('/admin',router)
}