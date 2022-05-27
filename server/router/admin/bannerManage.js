
module.exports = app =>{
  const express = require('express')
  const router = express.Router()
  const connection = require('../../plugins/connectMysql')()
  const {selectAll,update} = require('../../plugins/mysql_query')

  router.post('/banner',(req, res) => {
    const selectBanner = selectAll('mall_banner')
    connection.query(selectBanner,(err,result)=>{
      if (err) throw err
      res.send(result)
    })
  })

  router.post('/operationBanner',(req, res) => {
    const paramsObj = JSON.parse(JSON.stringify(req.body))

    Boolean(Number(paramsObj.isShow))?(()=>{
      updateBanner(paramsObj.id,0,{operation_responsive:0})
    })():(()=>{
      updateBanner(paramsObj.id,1,{operation_responsive:1})
    })()

    function updateBanner (id,code,responsive){
      let updateB = update('mall_banner',`isShow = ${code}`,`brand_id = ${id}`)
      connection.query(updateB,(err,upR)=>{
        if (err) throw err
        if (upR){
          res.send(responsive)
        }
      })
    }
  })

  app.use('/admin',router)
}