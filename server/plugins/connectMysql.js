const mysql = require('mysql')
//let connection = null

// module.exports = function connect () {
//     connection = mysql.createConnection({
//         host:'localhost',
//         user:'root',
//         password:'19961212',
//         database:'user',
//         multipleStatements: true
//     })
//
//     //连接数据库
//     connection.connect()
//
//     //mysql错误处理
//     connection.on('error', err => {
//         //当数据库出现错误时重连数据库
//         if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR' || err.code === 'ETIMEDOUT') {
//             connect()
//         }
//         else {
//             connect()
//         }
//     })
//     return connection
// }
module.exports = function connect(){
    let pool = mysql.createPool({
        host:'localhost',
        user:'root',
        password:'19961212',
        database:'user',
        multipleStatements: true
    })
    return pool
}

