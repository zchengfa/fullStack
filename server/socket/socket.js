module.exports = server => {
    const socket = require('socket.io')
    const io = socket(server,{
        cors:{
            origin:'*'
        }
    })

    io.on('connection', (socket) => {
        socket.on('online', data => {

            console.log('用户:'+data + '上线了')
        })
        socket.on('send',res => {
            console.log( )
        })
    })
}