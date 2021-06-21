const mysql = require('mysql')
let connection = null

module.exports = function connect () {
    connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'19961212',
        database:'user',
        multipleStatements: true
    })

    //连接数据库
    connection.connect((err)=> {
        if (err) {
            connect()
        }
    })

    //mysql错误处理
    connection.on('error', err => {
        //当数据库断开连接时重连数据库
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect()
        }
        else {
            connect()
        }
    })
    return connection
}

