const mysql_query = require('./mysql_query.js');
const connection = require('./connectMysql.js')();
let lastCheckTime = new Date();

module.exports = function poll(clients){
    const query = mysql_query.selectAll('data_changes','change_time > ?');
    connection.query(query,[lastCheckTime],function(err,rows){
        if(rows.length > 0){
            clients.forEach(client => client.send('data_updated',JSON.stringify(rows)));
            lastCheckTime = new Date();
        }
        console.log(rows,'poll')
    })

    setTimeout(poll,1000);
}

