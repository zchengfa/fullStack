module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const connect = require('../../plugins/connectMysql')
    const {selectFields} = require('../../plugins/mysql_query')

    router.get('/memberManage',(req, res) => {
        const connection = connect()
        const selectUser = selectFields('user','user_id,account,username,identity,register_time')
        connection.query(selectUser, (err,result) => {
            if (err) throw err
            else {
                res.send(result)
            }
        })
    })

    app.use('/admin',router)
}