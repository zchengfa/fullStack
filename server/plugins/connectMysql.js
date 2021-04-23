const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1996',
    database:'user'
})

connection.connect()

module.exports = connection