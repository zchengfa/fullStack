const {deDuplication} = require("../../util/arrayOperation");
module.exports = app =>{
  const express = require('express')
  const router = express.Router()
  const {selectFields} = require('../../plugins/mysql_query')
  const connection = require('../../plugins/connectMysql')()
  const {deDuplication} = require('../../util/arrayOperation')

  router.post('/getOrderData',(req, res) => {
    //const selectUser = selectFields('mall_user','username,account',`user_id = ${id}`)
    const selectOrder = selectFields('mall_store_order','user_id,order_id,payment_status')
    connection.query(selectOrder,(err,result)=>{
      if (err) throw err
      if (result.length){
        let userArr = []
        result.map(item=>{
          userArr.push(item.user_id)
        })
        userArr = deDuplication(userArr)

        let finishCount = 0
        userArr.map(user=>{
          const selectUser = selectFields('mall_user','username,account',`user_id = ${user}`)
          connection.query(selectUser,(err,userR)=>{
            if (err) throw err
            if (userR){
              if(userR.length){
                userR[0]['user_id'] = user
                userArr[finishCount] = userR[0]
              }
              finishCount++
            }

            finishCount===userArr.length?(()=>{
              res.send({
                'order':result,
                'user_info':userArr
              })
            })():null
          })
        })

      }
      else{
        res.send([])
      }
    })
  })

  app.use('/admin',router)
}