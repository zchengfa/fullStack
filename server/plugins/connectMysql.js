const mysql = require('mysql')

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'19961212',
    database:'user'
})

connection.connect((err)=> {
    if (err) throw err
    console.log('mysql connect success')
})

module.exports = connection