const {update} = require("../../plugins/mysql_query");

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

  router.post('/addSeckill',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))

    let updateFinish = 0
    paramsObj.data.map(item=>{
      const updateSeckill = update('mall_goods',`preferential_type = '秒杀',flash_sale_time = ${paramsObj.time}`,`product_id = '${item.product_id}'`)
      connection.query(updateSeckill,(err,upR)=>{
        if (err) throw err
        console.log(upR)
        if (Object.keys(upR).length){
          updateFinish++
        }
        updateFinish===paramsObj.data.length?res.send({'addResult':true}):null
      })
    })
  })

  router.post('/removeSeckill',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))
    const updateSeckill = update('mall_goods',`preferential_type = ''`,`product_id = '${paramsObj.id}'`)
    connection.query(updateSeckill,(err,upR)=>{
      if (err) throw err
      if (Object.keys(upR).length){
        res.send({'removeResult':true})
      }
    })
  })

  app.use('/admin',router)
}