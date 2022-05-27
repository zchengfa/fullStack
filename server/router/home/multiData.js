module.exports = app =>{
    const express = require('express')

    const router = express.Router()

    const {selectAll} = require('../../plugins/mysql_query')
    const connection = require('../../plugins/connectMysql')()

    router.get('/multiData', (req, res)=>{
        const selectQuery = selectAll('mall_banner',`isShow = 1`)
        connection.query(selectQuery, (err,result)=>{
           if (err) throw err
            result?res.send(result):null
       })

    })

    app.use('/home/api', router)
}
