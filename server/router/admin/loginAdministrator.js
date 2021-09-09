module.exports = app => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const router = express.Router()

    //用于解析post请求体中传递过来的参数
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}))

   router.post('/loginAdministrator',(req,res)=> {
       const paramsObj = JSON.parse(JSON.stringify(req.body))
       console.log(paramsObj)
       res.send('lll')
   })

    app.use('/admin',router)
}